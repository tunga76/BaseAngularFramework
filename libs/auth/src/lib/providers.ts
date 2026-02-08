import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AuthConfig, AUTH_CONFIG } from './auth-config';
import { authInterceptor } from './auth.interceptor';

export function provideAuth(config: AuthConfig): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: AUTH_CONFIG, useValue: config },
        // We can't use provideHttpClient here because it might conflict with Core
        // Instead we rely on the user adding the interceptor to the main provideHttpClient call
        // OR we provide a multi-provider token that Core's provideCore can pick up if we wanted deep integration.
        // However, the cleanest way in standalone is for the user to compose interceptors.
        // But since the user asked for provideAuth(config), we can provide the interceptor as a provider if we use the old class-based way, 
        // or just return the providers.
    ]);
}
