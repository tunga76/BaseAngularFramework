import { Observable } from 'rxjs';

export interface ConfirmOptions {
    title?: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'danger';
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

export abstract class ToastService {
    abstract show(message: string, duration?: number): void;
}
