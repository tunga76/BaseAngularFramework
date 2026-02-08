import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCore } from '@platform/core';
import { provideAuth, authInterceptor } from '@platform/auth';
import { provideUiFeedback } from '@platform/ui-feedback';
import { provideObservability, apiPerformanceInterceptor } from '@platform/observability';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter([]),
        provideCore({
            apiUrl: 'https://demo.duendesoftware.com/api',
            production: false,
            logLevel: 'debug',
            inactivity: {
                enabled: true,
                idleTimeoutMs: 5 * 60 * 1000, // 5 minutes
                warningBeforeMs: 30 * 1000    // 30 seconds warning
            }
        }),
        provideAuth({
            clientId: 'interactive.public',
            pkce: true,
            responseType: 'code',
            usePkce: true,
            useRefreshToken: true,
            useIdTokenHint: true,
            useNonce: true,
            issuer: 'https://demo.duendesoftware.com/connect',
            redirectUri: window.location.origin + '/callback',
            scope: 'api openid profile email offline_access',
            postLogoutRedirectUri: window.location.origin
        }),
        provideUiFeedback(),
        provideObservability({
            enabled: true,
            plugins: [],
            trackApiPerformance: true
        }),
        provideHttpClient(
            withInterceptors([
                authInterceptor,
                apiPerformanceInterceptor
            ])
        )
    ]
};
