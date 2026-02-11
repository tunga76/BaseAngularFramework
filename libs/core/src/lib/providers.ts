import { EnvironmentProviders, makeEnvironmentProviders, inject } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CoreConfig, CORE_CONFIG } from './config/core-config';
import { LoggerService, DefaultLoggerService, LOGGER_SERVICE } from './logging/logger.service';
import { loadingInterceptor } from './http/interceptors/loading.interceptor';
import { errorInterceptor } from './http/interceptors/error.interceptor';
import { loggingInterceptor } from './http/interceptors/logging.interceptor';
import {
    StorageService,
    STORAGE_SERVICE,
    LocalStorageService,
    EncryptedStorageService,
    STORAGE_ENCRYPTION_KEY
} from './storage/storage.service';

export function provideCore(config: CoreConfig): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: CORE_CONFIG, useValue: config },
        { provide: LOGGER_SERVICE, useClass: DefaultLoggerService },
        { provide: LoggerService, useClass: DefaultLoggerService },
        {
            provide: STORAGE_ENCRYPTION_KEY,
            useValue: config.storageSecret || 'default-secret-key'
        },
        // Provide LocalStorageService so strict DI (PLATFORM_ID) works
        LocalStorageService,
        {
            provide: STORAGE_SERVICE,
            useFactory: (baseStorage: LocalStorageService, secretKey: string) => {
                return new EncryptedStorageService(baseStorage, secretKey);
            },
            deps: [LocalStorageService, STORAGE_ENCRYPTION_KEY]
        },
        {
            provide: StorageService,
            useFactory: (baseStorage: LocalStorageService, secretKey: string) => {
                return new EncryptedStorageService(baseStorage, secretKey);
            },
            deps: [LocalStorageService, STORAGE_ENCRYPTION_KEY]
        },
        provideHttpClient(
            withInterceptors([
                loggingInterceptor,
                loadingInterceptor,
                errorInterceptor
            ])
        )
    ]);
}
