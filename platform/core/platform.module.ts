import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { PlatformConfig } from './config/platform-config';
import { APP_PLATFORM_CONFIG } from './tokens/app-platform-config.token';

import { ThemeService } from '../theme/services/theme.service';
import { BrandService } from '../theme/services/brand.service';
import { LoadingService } from '../loading/services/loading.service';
import { PopupService } from '../popup/services/popup.service';
import { PlatformHttpService } from '../http/services/platform-http.service';

import { GlobalLoadingComponent } from '../loading/components/global-loading.component';
import { ModalHostComponent } from '../popup/components/modal-host.component';

import { LoadingInterceptor } from '../http/interceptors/loading.interceptor';
import { ErrorInterceptor } from '../http/interceptors/error.interceptor';
import { AuthInterceptor } from '../http/interceptors/auth.interceptor';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        GlobalLoadingComponent,
        ModalHostComponent
    ],
    exports: [
        GlobalLoadingComponent,
        ModalHostComponent
    ]
})
export class PlatformModule {
    static forRoot(config: PlatformConfig): ModuleWithProviders<PlatformModule> {
        return {
            ngModule: PlatformModule,
            providers: [
                { provide: APP_PLATFORM_CONFIG, useValue: config },
                ThemeService,
                BrandService,
                LoadingService,
                PopupService,
                PlatformHttpService,
                {
                    provide: APP_INITIALIZER,
                    useFactory: (theme: ThemeService, brand: BrandService) => () => {
                        theme.init();
                        brand.init();
                        // Theme init is called in constructor, but we'll be explicit
                    },
                    deps: [ThemeService, BrandService],
                    multi: true
                },
                { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
                { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
                { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
            ]
        };
    }
}
