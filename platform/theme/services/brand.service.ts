import { Injectable, Inject } from '@angular/core';
import { BrandConfig } from '../models/brand-config';
import { APP_PLATFORM_CONFIG } from '../../core/tokens/app-platform-config.token';
import { PlatformConfig } from '../../core/config/platform-config';

@Injectable({
    providedIn: 'root'
})
export class BrandService {
    constructor(@Inject(APP_PLATFORM_CONFIG) private config: PlatformConfig) { }

    init(): void {
        this.applyBrand(this.config.brand);
    }

    applyBrand(brand: BrandConfig): void {
        const root = document.documentElement;
        root.style.setProperty('--brand-primary', brand.primaryColor);
        root.style.setProperty('--brand-secondary', brand.secondaryColor);

        if (brand.fontFamily) {
            root.style.setProperty('--font-family-base', brand.fontFamily);
        }
    }
}
