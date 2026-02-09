import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideCore } from '@platform/core';
import { provideAuth, authInterceptor, permissionGuard } from '@platform/auth';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideUiFeedback, MaterialUiService, NgxSpinnerImplService } from '@platform/ui-feedback';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideObservability, apiPerformanceInterceptor } from '@platform/observability';
import { ConsoleLoggerPlugin } from './observability-console.plugin';
import { provideAppPlatform, LOADING_ADAPTER, POPUP_ADAPTER, MaterialPopupAdapter } from '@platform/framework';
import { NgxSpinnerAdapter } from './adapters/ngx-spinner.adapter';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter([
            { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
            { path: 'callback', loadComponent: () => import('./auth/callback.component').then(m => m.CallbackComponent) },
            {
                path: 'admin',
                loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
                canActivate: [permissionGuard('Kullanici')]
            },
            {
                path: 'reports',
                loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
                canActivate: [permissionGuard('Kullanici')]
            },
            { path: 'settings', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
            { path: 'forms', loadComponent: () => import('./forms/form-list.component').then(m => m.FormListComponent) },
            { path: 'form-preview', loadComponent: () => import('./forms/form-preview.component').then(m => m.FormPreviewComponent) },
            { path: 'form-builder', loadComponent: () => import('@platform/form-builder').then(m => m.SampleBuilderUsageComponent) },
            { path: '**', redirectTo: '' }
        ]),
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
            apiUrl: 'https://localhost:5001', // Keep orig for auth if needed, but platform uses its own config
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
            clientId: 'angular_dev.app',
            pkce: true,
            responseType: 'code',
            usePkce: true,
            useRefreshToken: true,
            useIdTokenHint: true,
            useNonce: true,
            issuer: 'https://localhost:5001/connect',
            redirectUri: window.location.origin + '/callback',
            scope: 'openid profile api1 offline_access',
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
        {
            provide: LOADING_ADAPTER,
            useClass: NgxSpinnerAdapter
        },
        {
            provide: POPUP_ADAPTER,
            useClass: MaterialPopupAdapter
        },
        provideObservability({
            enabled: true,
            plugins: [new ConsoleLoggerPlugin()],
            trackApiPerformance: true
        }),
        provideHttpClient(
            withInterceptors([
                authInterceptor,
                apiPerformanceInterceptor
            ]),
            withInterceptorsFromDi()
        )
    ]
};
