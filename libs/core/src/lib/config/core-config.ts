import { InjectionToken } from '@angular/core';

export interface InactivityConfig {
    enabled: boolean;
    idleTimeoutMs: number;
    warningBeforeMs?: number;
}

export interface CoreConfig {
    apiUrl: string;
    appName?: string;
    production: boolean;
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
    inactivity?: InactivityConfig;
}

export const CORE_CONFIG = new InjectionToken<CoreConfig>('PLATFORM_CORE_CONFIG');
