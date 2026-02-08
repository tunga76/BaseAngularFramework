import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { ResilienceInterceptor } from './interceptors/resilience.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { APP_PLATFORM_CONFIG } from './core/tokens';
import { AppPlatformConfig } from './config/framework-config';

export const provideAppPlatform = (config: AppPlatformConfig): EnvironmentProviders => {
    return makeEnvironmentProviders([
        {
            provide: APP_PLATFORM_CONFIG,
            useValue: config
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ResilienceInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ]);
};

export const appPlatformProviders = (config: AppPlatformConfig): Provider[] => {
    return [
        {
            provide: APP_PLATFORM_CONFIG,
            useValue: config
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ResilienceInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ];
};
