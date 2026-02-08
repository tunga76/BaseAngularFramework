import { InjectionToken } from '@angular/core';

export interface AuthConfig {
    clientId: string;
    issuer: string;
    redirectUri: string;
    postLogoutRedirectUri?: string;
    scope?: string;
    autoSilentRefresh?: boolean;
    responseType?: string;
    pkce?: boolean;
    usePkce?: boolean;
    useRefreshToken?: boolean;
    useIdTokenHint?: boolean;
    useNonce?: boolean;
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('PLATFORM_AUTH_CONFIG');
