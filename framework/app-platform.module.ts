import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPlatformConfig } from './config/framework-config';
import { appPlatformProviders } from './providers';

@NgModule({
    imports: [CommonModule]
})
export class AppPlatformModule {
    static forRoot(config: AppPlatformConfig): ModuleWithProviders<AppPlatformModule> {
        return {
            ngModule: AppPlatformModule,
            providers: appPlatformProviders(config)
        };
    }
}
