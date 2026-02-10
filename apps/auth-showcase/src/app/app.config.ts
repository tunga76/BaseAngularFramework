import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideCore, authInterceptor } from '@platform/core';
import { provideAuth } from '@platform/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),

    // Core Configuration
    provideCore({
      apiUrl: 'https://localhost:5001',
      production: false,
      storageSecret: 'auth-showcase-secret',
      inactivity: {
        enabled: true,
        idleTimeoutMs: 120000, // 2 minutes
        warningBeforeMs: 15000 // 15 seconds warning
      }
    }),

    // Auth Configuration
    provideAuth({
      clientId: 'angular_dev.app',
      issuer: 'https://localhost:5001/connect',
      redirectUri: window.location.origin + '/callback',
      postLogoutRedirectUri: window.location.origin,
      scope: 'openid profile api1 offline_access',
      responseType: 'code',
      usePkce: true
    }),

    // HTTP Client with Auth Interceptor
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
