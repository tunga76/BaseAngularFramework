import { Observable } from 'rxjs';

export interface ConfirmOptions {
    title?: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'success' | 'warning' | 'danger';
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
    abstract show(name?: string, options?: SpinnerOptions): void;
    abstract hide(name?: string): void;
}
