// Config
export * from './config/auth-config';

// Models
export * from './models/token.model';
export * from './models/user-claims.model';
export * from './models/auth-session.model';

// Services
export * from './services/auth.service';
export * from './services/session.service';
export * from './services/token.service';
export * from './services/userinfo.service';
export * from './services/logout.service';

// Storage
export * from './storage/token-storage.interface';
export * from './storage/memory-token.storage';
export * from './storage/session-token.storage';

// Guards
export * from './guards/auth.guard';
export * from './guards/permission.guard';

// Http
export * from './http/auth.interceptor';
export * from './http/token-refresh.interceptor';

// Directives
export * from './directives/has-permission.directive';

// Providers
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AuthConfig, AUTH_CONFIG } from './config/auth-config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './http/auth.interceptor';
import { tokenRefreshInterceptor } from './http/token-refresh.interceptor';
import { TokenStorage, TOKEN_STORAGE } from './storage/token-storage.interface';
import { MemoryTokenStorage } from './storage/memory-token.storage';

export function provideAuthCore(config: AuthConfig): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: AUTH_CONFIG, useValue: config },
        { provide: TOKEN_STORAGE, useClass: MemoryTokenStorage },
        provideHttpClient(withInterceptors([authInterceptor, tokenRefreshInterceptor]))
    ]);
}
