import { BrandConfig } from '../../theme/models/brand-config';

export interface PlatformConfig {
    defaultTheme: 'light' | 'dark';
    brand: BrandConfig;
    http: {
        showGlobalLoading: boolean;
        showErrorPopup: boolean;
    };
}
