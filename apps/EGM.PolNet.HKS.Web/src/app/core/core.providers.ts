import { ErrorHandler, Provider, EnvironmentProviders } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { GlobalErrorHandler } from './error-handling/global-error-handler';

export function provideCore(): (Provider | EnvironmentProviders)[] {
    return [
        provideHttpClient(
            withInterceptors([authInterceptor])
        ),
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        }
    ];
}
