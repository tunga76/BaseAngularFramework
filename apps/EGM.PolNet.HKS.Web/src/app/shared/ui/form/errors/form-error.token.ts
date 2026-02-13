import { InjectionToken } from '@angular/core';

export interface FormErrorConfig {
    [key: string]: (error?: any, label?: string) => string;
}

export const FORM_ERROR_CONFIG = new InjectionToken<FormErrorConfig>(
    'FORM_ERROR_CONFIG'
);
