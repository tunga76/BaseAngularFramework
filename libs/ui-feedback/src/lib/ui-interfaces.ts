import { Observable } from 'rxjs';

/**
 * Extended dialog result with metadata about how it was dismissed.
 */
export interface DialogResult<T = boolean> {
    /** Whether the dialog was confirmed */
    confirmed: boolean;
    /** Optional data payload */
    data?: T;
    /** How the dialog was dismissed */
    dismissedBy?: 'backdrop' | 'escape' | 'close-button' | 'confirm' | 'cancel';
}

export interface ConfirmOptions {
    title?: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'success' | 'warning' | 'danger';
    /** Allow HTML content (will be sanitized) */
    allowHtml?: boolean;
    /** Sanitize HTML content (default: true) */
    sanitize?: boolean;
}

export abstract class ConfirmService {
    abstract ask(message: string, options?: ConfirmOptions): Observable<boolean>;
}

export abstract class AlertService {
    abstract success(message: string): void;
    abstract error(message: string): void;
    abstract info(message: string): void;
    abstract warn(message: string): void;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
    duration?: number;
    type?: ToastType;
    action?: string;
    horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
    verticalPosition?: 'top' | 'bottom';
    /** Allow HTML content (will be sanitized) */
    allowHtml?: boolean;
    /** Sanitize HTML content (default: true) */
    sanitize?: boolean;
}

export abstract class ToastService {
    abstract show(message: string, options?: ToastOptions | number): void;
}

export interface SpinnerOptions {
    type?: string;
    bdColor?: string;
    color?: string;
    size?: 'small' | 'medium' | 'large';
    fullScreen?: boolean;
}

export abstract class SpinnerService {
    message?: string;
    abstract show(name?: string, options?: SpinnerOptions): void;
    abstract hide(name?: string): void;
}
