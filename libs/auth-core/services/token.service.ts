import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, timer, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AUTH_CONFIG, AuthConfig } from '../config/auth-config';
import { TokenStorage, TOKEN_STORAGE } from '../storage/token-storage.interface';
import { TokenResponse, AccessTokenPayload } from '../models/token.model';

@Injectable({ providedIn: 'root' })
export class TokenService {
    private refreshSubscription: Subscription | null = null;

    constructor(
        @Inject(AUTH_CONFIG) private config: AuthConfig,
        @Inject(TOKEN_STORAGE) private storage: TokenStorage,
        private http: HttpClient
    ) { }

    saveToken(response: TokenResponse): void {
        this.storage.saveToken(response);
        // Schedule refresh. If expires_in is present, use it. otherwise default or decode?
        // Access token usually has exp. Token response has expires_in.
        if (response.expires_in) {
            this.scheduleRefresh(response.expires_in);
        }
    }

    getAccessToken(): string | null {
        return this.storage.getAccessToken();
    }

    hasValidAccessToken(): boolean {
        const token = this.getAccessToken();
        if (!token) return false;
        const payload = this.decodeToken(token);
        if (!payload) return false;
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now + 10; // 10s buffer
    }

    decodeToken(token: string): AccessTokenPayload | null {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            const decoded = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(decoded);
        } catch {
            return null;
        }
    }

    refreshTokens(): Observable<TokenResponse | null> {
        let params = new HttpParams()
            .set('grant_type', 'refresh_token')
            .set('client_id', this.config.clientId);

        const rt = this.storage.getRefreshToken();
        if (rt) {
            params = params.set('refresh_token', rt);
        }

        return this.http.post<TokenResponse>(`${this.config.authority}/token`, params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).pipe(
            tap(res => this.saveToken(res)),
            catchError(err => {
                console.error('Token Refresh Failed', err);
                this.stopRefresh();
                this.storage.clear();
                return of(null);
            })
        );
    }

    private scheduleRefresh(expiresIn: number): void {
        this.stopRefresh();

        // Refresh 60 seconds before expiry
        // ensure we don't use negative time if token is already expired or close.
        const refreshTime = Math.max(0, (expiresIn - 60) * 1000);

        this.refreshSubscription = timer(refreshTime).pipe(
            switchMap(() => this.refreshTokens())
        ).subscribe();
    }

    stopRefresh(): void {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
            this.refreshSubscription = null;
        }
    }
}
