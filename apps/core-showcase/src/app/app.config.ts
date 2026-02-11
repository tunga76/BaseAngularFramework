import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCore } from '@platform/core';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),

    // Core Configuration
    provideCore({
      apiUrl: 'https://localhost:5001',
      production: false,
      appName: 'Core Showcase',
      logLevel: 'debug',
      storageSecret: 'core-showcase-secret',
      inactivity: {
        enabled: true,
        idleTimeoutMs: 60000, // 1 min for demo
        warningBeforeMs: 10000
      }
    }),
  ],
};
