import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AUTH_CONFIG } from './auth-config';
import { ApiClient, STORAGE_SERVICE, LOGGER_SERVICE, InactivityService } from '@platform/core';
import { generateCodeChallenge, generateCodeVerifier, generateState } from './pkce.utils';

export interface AuthState {
    accessToken: string | null;
    idToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
    userClaims: any | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private config = inject(AUTH_CONFIG);
    private apiClient = inject(ApiClient);
    private storage = inject(STORAGE_SERVICE);
    private logger = inject(LOGGER_SERVICE);
    private inactivity = inject(InactivityService, { optional: true });

    private state = signal<AuthState>({
        accessToken: null,
        idToken: null,
        refreshToken: null,
        expiresAt: null,
        userClaims: null
    });

    private refreshInProgress$: Observable<any> | null = null;

    constructor() {
        this.inactivity?.timeout$.subscribe(() => {
            this.logger.info('Inactivity timeout reached, logging out...');
            this.logout();
        });
    }

    readonly accessToken = () => this.state().accessToken;
    readonly isAuthenticated = () => !!this.state().accessToken;

    isAuthenticated$(): Observable<boolean> {
        return of(this.isAuthenticated());
    }

    getAccessToken(): Observable<string | null> {
        const state = this.state();
        if (!state.accessToken) {
            return of(null);
        }

        // Buffer time: 30 seconds
        const isExpired = state.expiresAt && (Date.now() + 30000) > state.expiresAt;
        if (isExpired && state.refreshToken) {
            return this.refresh();
        }

        return of(state.accessToken);
    }

    async login(): Promise<void> {
        const verifier = await generateCodeVerifier();
        const state = generateState();

        this.storage.setItem('pkce_verifier', verifier);
        this.storage.setItem('pkce_state', state);

        const challenge = await generateCodeChallenge(verifier);

        const params = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            response_type: 'code',
            scope: this.config.scope || 'openid profile email',
            code_challenge: challenge,
            code_challenge_method: 'S256',
            state: state
        });

        window.location.href = `${this.config.issuer}/authorize?${params.toString()}`;
    }

    handleRedirectCallback(): Observable<boolean> {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const storedState = this.storage.getItem('pkce_state');
        const verifier = this.storage.getItem('pkce_verifier');

        if (!code || state !== storedState || !verifier) {
            return of(false);
        }

        this.storage.removeItem('pkce_state');
        this.storage.removeItem('pkce_verifier');

        const body = new HttpParams()
            .set('grant_type', 'authorization_code')
            .set('code', code)
            .set('redirect_uri', this.config.redirectUri)
            .set('client_id', this.config.clientId)
            .set('code_verifier', verifier);

        return this.apiClient.post<any>(`${this.config.issuer}/token`, body, {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        }).pipe(
            tap(res => this.updateState(res)),
            map(() => true),
            catchError(err => {
                this.logger.error('Auth callback failed', err);
                return of(false);
            })
        );
    }

    refresh(): Observable<string> {
        if (this.refreshInProgress$) {
            return this.refreshInProgress$;
        }

        const refreshToken = this.state().refreshToken;
        if (!refreshToken) {
            return throwError(() => new Error('No refresh token available'));
        }

        const body = new HttpParams()
            .set('grant_type', 'refresh_token')
            .set('refresh_token', refreshToken)
            .set('client_id', this.config.clientId);

        this.refreshInProgress$ = this.apiClient.post<any>(`${this.config.issuer}/token`, body, {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        }).pipe(
            map(res => {
                this.updateState(res);
                this.refreshInProgress$ = null;
                return res.access_token;
            }),
            catchError(err => {
                this.refreshInProgress$ = null;
                this.logout();
                return throwError(() => err);
            })
        );

        return this.refreshInProgress$;
    }

    logout(): void {
        this.state.set({ accessToken: null, idToken: null, refreshToken: null, expiresAt: null, userClaims: null });
        if (this.config.postLogoutRedirectUri) {
            window.location.href = `${this.config.issuer}/logout?post_logout_redirect_uri=${encodeURIComponent(this.config.postLogoutRedirectUri)}`;
        }
    }

    getUserClaims(): any {
        return this.state().userClaims;
    }

    private updateState(response: any): void {
        this.state.set({
            accessToken: response.access_token,
            idToken: response.id_token,
            refreshToken: response.refresh_token || this.state().refreshToken,
            expiresAt: Date.now() + (response.expires_in * 1000),
            userClaims: this.decodeToken(response.id_token || response.access_token)
        });
    }

    private decodeToken(token: string): any {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
        } catch (e) {
            return null;
        }
    }
}
