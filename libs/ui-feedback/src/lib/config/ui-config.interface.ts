import { InjectionToken } from '@angular/core';

/**
 * Dialog-specific configuration options.
 */
export interface DialogConfig {
    /** Default dialog type */
    defaultType?: 'info' | 'success' | 'warning' | 'danger';
    /** Default confirm button text */
    defaultConfirmText?: string;
    /** Default cancel button text */
    defaultCancelText?: string;
    /** Disable closing dialog by clicking backdrop */
    disableBackdropClick?: boolean;
    /** Auto-close after specified milliseconds (0 = no auto-close) */
    autoCloseDuration?: number;
}

/**
 * Toast-specific configuration options.
 */
export interface ToastConfig {
    /** Default toast duration in milliseconds */
    defaultDuration?: number;
    /** Default toast position */
    defaultPosition?: {
        horizontal: 'start' | 'center' | 'end' | 'left' | 'right';
        vertical: 'top' | 'bottom';
    };
    /** Maximum number of toasts to show simultaneously */
    maxToasts?: number;
}

/**
 * Security-related configuration options.
 */
export interface SecurityConfig {
    /** Enable HTML sanitization (recommended: true) */
    sanitizeHtml?: boolean;
    /** List of allowed HTML tags (if empty, uses DomSanitizer defaults) */
    allowedTags?: string[];
    /** Strictly escape all HTML (no HTML rendering allowed) */
    strictMode?: boolean;
}

/**
 * Global configuration for UI Feedback library.
 */
export interface UiFeedbackGlobalConfig {
    dialog?: DialogConfig;
    toast?: ToastConfig;
    security?: SecurityConfig;
}

/**
 * Injection token for global UI Feedback configuration.
 */
export const UI_FEEDBACK_CONFIG = new InjectionToken<UiFeedbackGlobalConfig>(
    'UI_FEEDBACK_CONFIG'
);

/**
 * Default global configuration.
 */
export const DEFAULT_UI_FEEDBACK_CONFIG: UiFeedbackGlobalConfig = {
    dialog: {
        defaultType: 'info',
        defaultConfirmText: 'OK',
        defaultCancelText: 'Cancel',
        disableBackdropClick: false,
        autoCloseDuration: 0,
    },
    toast: {
        defaultDuration: 3000,
        defaultPosition: {
            horizontal: 'right',
            vertical: 'top',
        },
        maxToasts: 3,
    },
    security: {
        sanitizeHtml: true,
        allowedTags: [],
        strictMode: false,
    },
};
