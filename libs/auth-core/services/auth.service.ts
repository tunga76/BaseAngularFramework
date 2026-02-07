import { Injectable, Inject } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AUTH_CONFIG, AuthConfig } from '../config/auth-config';
import { PkceService } from '../pkce/pkce.service';
import { TokenService } from './token.service';
import { SessionService } from './session.service';
import { UserInfoService } from './userinfo.service';
import { LogoutService } from './logout.service';
import { TokenResponse } from '../models/token.model';
import { UserClaims } from '../models/user-claims.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(
        @Inject(AUTH_CONFIG) private config: AuthConfig,
        private pkceService: PkceService,
        private tokenService: TokenService,
        private sessionService: SessionService,
        private userInfoService: UserInfoService,
        private logoutService: LogoutService,
        private http: HttpClient
    ) { }

    async login(targetUrl?: string): Promise<void> {
        const { verifier, challenge } = await this.pkceService.generateChallengePair();
        const state = this.pkceService.generateState();
        const nonce = this.pkceService.generateNonce();

        this.pkceService.saveTransaction(state, verifier, nonce);

        if (targetUrl) {
            sessionStorage.setItem('auth_target_url', targetUrl);
        }

        const params = new HttpParams()
            .set('client_id', this.config.clientId)
            .set('redirect_uri', this.config.redirectUri)
            .set('response_type', this.config.responseType || 'code')
            .set('scope', this.config.scopes.join(' '))
            .set('state', state)
            .set('code_challenge', challenge)
            .set('code_challenge_method', 'S256')
            .set('nonce', nonce);

        window.location.href = `${this.config.authority}/authorize?${params.toString()}`;
    }

    logout(): void {
        this.logoutService.logout();
    }

    handleRedirectCallback(url?: string): Observable<boolean> {
        const searchParams = new URLSearchParams(url || window.location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
            return throwError(() => new Error(`Auth Error: ${error}`));
        }

        if (!code || !state) {
            return throwError(() => new Error('No code or state in callback'));
        }

        const transaction = this.pkceService.loadTransaction();
        if (transaction.state !== state) {
            return throwError(() => new Error('Invalid state'));
        }

        if (!transaction.verifier) {
            return throwError(() => new Error('No code verifier found'));
        }

        this.sessionService.setLoading(true);

        const body = new HttpParams()
            .set('grant_type', 'authorization_code')
            .set('client_id', this.config.clientId)
            .set('redirect_uri', this.config.redirectUri)
            .set('code', code)
            .set('code_verifier', transaction.verifier);

        return this.http.post<TokenResponse>(`${this.config.authority}/token`, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).pipe(
            tap(res => {
                this.tokenService.saveToken(res);
            }),
            switchMap(() => {
                if (this.config.autoUserInfo !== false) {
                    return this.userInfoService.loadUserInfo().pipe(
                        tap(user => this.sessionService.setUser(user)),
                        catchError(() => of(null))
                    );
                }
                return of(null);
            }),
            tap(() => {
                this.sessionService.setIsAuthenticated(true);
                this.sessionService.setLoading(false);
                this.pkceService.clearTransaction();
            }),
            map(() => true),
            catchError(err => {
                this.sessionService.setLoading(false);
                this.sessionService.setError(typeof err === 'string' ? err : 'Authentication Failed');
                return throwError(() => err);
            })
        );
    }

    isAuthenticated$(): Observable<boolean> {
        return this.sessionService.isAuthenticated$;
    }

    getAccessToken(): string | null {
        return this.tokenService.getAccessToken();
    }

    getUserClaims(): Observable<UserClaims | null> {
        return this.sessionService.user$;
    }
}
