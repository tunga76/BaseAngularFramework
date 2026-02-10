import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError, firstValueFrom } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
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

const AUTH_STATE_KEY = 'platform_auth_state';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private config = inject(AUTH_CONFIG);
    private apiClient = inject(ApiClient);
    private http = inject(HttpClient);
    private storage = inject(STORAGE_SERVICE);
    private logger = inject(LOGGER_SERVICE);
    private inactivity = inject(InactivityService, { optional: true });
    private document = inject(DOCUMENT);
    private platformId = inject(PLATFORM_ID);

    private state = signal<AuthState>({
        accessToken: null,
        idToken: null,
        refreshToken: null,
        expiresAt: null,
        userClaims: null
    });

    // Reactive signals
    readonly accessToken = computed(() => this.state().accessToken);
    readonly isAuthenticated = computed(() => !!this.state().accessToken);

    // Observable streams for legacy/async support
    readonly isAuthenticated$ = toObservable(this.isAuthenticated);

    private refreshInProgress$: Observable<any> | null = null;

    constructor() {
        this.loadState();

        if (this.inactivity) {
            this.inactivity.timeout$.subscribe(() => {
                this.logger.info('Inactivity timeout reached, logging out...');
                this.logout();
            });
        }
    }

    private loadState(): void {
        const savedState = this.storage.getObject<AuthState>(AUTH_STATE_KEY);
        if (savedState) {
            this.state.set(savedState);
            this.logger.debug('[Auth] State loaded from storage');
        }
    }

    getAccessToken(): Observable<string | null> {
        // Return as observable from signal for consistency, but logic for expiry check remains
        const state = this.state();
        if (!state.accessToken) {
            return of(null);
        }

        const now = Date.now();
        // Check if token is invalid or about to expire
        const isExpired = state.expiresAt && (now + 30000) > state.expiresAt;

        if (isExpired) {
            const timeLeftSec = state.expiresAt ? Math.floor((state.expiresAt - now) / 1000) : 0;
            this.logger.info(`[Auth] Token is expiring/expired (Left: ${timeLeftSec}s). Triggering refresh...`);
            if (state.refreshToken) {
                return this.refresh();
            } else {
                this.logger.warn('[Auth] Token expired but no refresh token available.');
            }
        }

        return of(state.accessToken);
    }

    async login(): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) {
            this.logger.warn('[Auth] Login called on server (SSR). Ignoring.');
            return;
        }

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

        this.document.location.href = `${this.config.issuer}/authorize?${params.toString()}`;
    }

    handleRedirectCallback(): Observable<boolean> {
        if (!isPlatformBrowser(this.platformId)) return of(false);

        const params = new URLSearchParams(this.document.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const storedState = this.storage.getItem('pkce_state');
        const verifier = this.storage.getItem('pkce_verifier');

        if (!code || state !== storedState || !verifier) {
            this.storage.removeItem('pkce_state');
            this.storage.removeItem('pkce_verifier');
            return of(false);
        }

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
            }),
            finalize(() => {
                this.storage.removeItem('pkce_state');
                this.storage.removeItem('pkce_verifier');
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

        const tokenUrl = `${this.config.issuer}/token`;
        this.logger.debug(`[Auth] Starting token refresh request to: ${tokenUrl}`);

        this.refreshInProgress$ = this.apiClient.post<any>(tokenUrl, body, {
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
        this.storage.removeItem(AUTH_STATE_KEY);

        if (isPlatformBrowser(this.platformId) && this.config.postLogoutRedirectUri) {
            this.document.location.href = `${this.config.issuer}/logout?post_logout_redirect_uri=${encodeURIComponent(this.config.postLogoutRedirectUri)}`;
        }
    }

    getUserClaims(): any {
        return this.state().userClaims;
    }

    /**
     * Helper to get all permissions and roles from the current user claims.
     */
    getPermissions(): string[] {
        const claims = this.getUserClaims();
        if (!claims) return [];

        const extractFromClaim = (claim: any): string[] => {
            if (!claim) return [];
            if (Array.isArray(claim)) return claim;
            if (typeof claim === 'string') {
                if (claim.trim().startsWith('[') && claim.trim().endsWith(']')) {
                    try {
                        return JSON.parse(claim);
                    } catch {
                        return [claim];
                    }
                }
                return [claim];
            }
            return [];
        };

        const permissions = extractFromClaim(claims.permissions);
        const roles = extractFromClaim(claims.role);
        const polnetRoles = extractFromClaim(claims.polnet_roles);
        const msRoles = extractFromClaim(claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);

        return [...new Set([...permissions, ...roles, ...polnetRoles, ...msRoles])];
    }

    private updateState(response: any): void {
        const expiresAt = Date.now() + (response.expires_in * 1000);

        // Try to get claims from ID Token first, then Access Token.
        const idTokenClaims = response.id_token ? this.decodeToken(response.id_token) : null;
        const accessTokenClaims = response.access_token ? this.decodeToken(response.access_token) : null;

        const mergedClaims = { ...(idTokenClaims || {}), ...(accessTokenClaims || {}) };

        this.logger.info(`[Auth] Token acquired. Expires at: ${new Date(expiresAt).toLocaleTimeString()}`);

        const newState: AuthState = {
            accessToken: response.access_token,
            idToken: response.id_token,
            refreshToken: response.refresh_token || this.state().refreshToken,
            expiresAt: expiresAt,
            userClaims: mergedClaims
        };

        this.state.set(newState);
        this.storage.setObject(AUTH_STATE_KEY, newState);
    }

    private decodeToken(token: string): any {
        if (!isPlatformBrowser(this.platformId)) return null;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            // Safe decoding for UTF-8
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            this.logger.warn('[Auth] Failed to decode token', undefined, e);
            return null;
        }
    }
}
