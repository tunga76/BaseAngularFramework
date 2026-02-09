import { HttpContextToken } from '@angular/common/http';

export interface PlatformHttpOptions {
    showLoading?: boolean;
    showErrorPopup?: boolean;
    timeout?: number;
}

export const PLATFORM_HTTP_OPTIONS = new HttpContextToken<PlatformHttpOptions>(() => ({
    showLoading: true,
    showErrorPopup: true
}));
