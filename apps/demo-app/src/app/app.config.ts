import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCore } from '@platform/core';
import { provideAuth, authInterceptor } from '@platform/auth';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideUiFeedback, MaterialUiService, NgxSpinnerImplService } from '@platform/ui-feedback';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideObservability, apiPerformanceInterceptor } from '@platform/observability';
import { ConsoleLoggerPlugin } from './observability-console.plugin';
import { provideAppPlatform } from '@platform/framework';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter([]),
        provideAppPlatform({
            api: {
                baseUrl: 'https://jsonplaceholder.typicode.com', // Using JSONPlaceholder for testing
                timeout: 5000
            },
            ui: {
                enablePopup: true,
                enableModal: true,
                enableLoading: true
            },
            debug: true
        }),
        provideCore({
            apiUrl: 'https://demo.duendesoftware.com/api', // Keep orig for auth if needed, but platform uses its own config
            production: false,
            logLevel: 'debug',
            storageSecret: 'my-super-secret-key-123',
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
        provideAnimations(),
        importProvidersFrom(NgxSpinnerModule),
        provideUiFeedback({
            alertService: MaterialUiService,
            confirmService: MaterialUiService,
            toastService: MaterialUiService,
            spinnerService: NgxSpinnerImplService
        }),
        provideObservability({
            enabled: true,
            plugins: [new ConsoleLoggerPlugin()],
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
