export interface ApiConfig {
    baseUrl: string;
    timeout?: number;
}

export interface UiConfig {
    enablePopup?: boolean;
    enableModal?: boolean;
    enableLoading?: boolean;
}

export interface AppPlatformConfig {
    api: ApiConfig;
    ui: UiConfig;
    debug?: boolean;
}
