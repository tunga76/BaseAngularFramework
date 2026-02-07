import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuthCore } from '@my-org/auth-core';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter([]),
        provideAuthCore({
            authority: 'https://demo.duendesoftware.com', // Using a public demo identity server for testing if possible, or placeholder
            clientId: 'interactive.public',
            redirectUri: window.location.origin,
            scopes: ['openid', 'profile', 'email', 'offline_access'],
            responseType: 'code',
            autoUserInfo: true
        })
    ]
};
