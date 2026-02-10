import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AuthConfig, AUTH_CONFIG } from './auth-config';
import { AuthService } from './auth.service';
import { AUTH_SERVICE } from '@platform/core';

export function provideAuth(config: AuthConfig): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: AUTH_CONFIG, useValue: config },
        { provide: AUTH_SERVICE, useExisting: AuthService }
    ]);
}
