import { Injectable, Inject } from '@angular/core';
import { AUTH_CONFIG, AuthConfig } from '../config/auth-config';
import { TokenStorage, TOKEN_STORAGE } from '../storage/token-storage.interface';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class LogoutService {
    constructor(
        @Inject(AUTH_CONFIG) private config: AuthConfig,
        @Inject(TOKEN_STORAGE) private storage: TokenStorage,
        private sessionService: SessionService
    ) { }

    logout(): void {
        this.storage.clear();
        this.sessionService.setIsAuthenticated(false);
        this.sessionService.setUser(null);

        let logoutUrl = `${this.config.authority}/logout`;
        // Support standard OIDC parameters if needed, or custom ones.
        if (this.config.postLogoutRedirectUri) {
            logoutUrl += `?post_logout_redirect_uri=${encodeURIComponent(this.config.postLogoutRedirectUri)}`;
        }

        window.location.href = logoutUrl;
    }
}
