import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CoreConfig, CORE_CONFIG } from './config/core-config';
import { DefaultLoggerService, LOGGER_SERVICE } from './logging/logger.service';
import { loadingInterceptor } from './http/interceptors/loading.interceptor';
import { errorInterceptor } from './http/interceptors/error.interceptor';
import { loggingInterceptor } from './http/interceptors/logging.interceptor';
import { MemoryStorageService, STORAGE_SERVICE } from './storage/storage.service';

export function provideCore(config: CoreConfig): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: CORE_CONFIG, useValue: config },
        { provide: LOGGER_SERVICE, useClass: DefaultLoggerService },
        { provide: STORAGE_SERVICE, useClass: MemoryStorageService },
        provideHttpClient(
            withInterceptors([
                loggingInterceptor,
                loadingInterceptor,
                errorInterceptor
            ])
        )
    ]);
}
