import { InjectionToken } from '@angular/core';

export interface NotificationService {
    showError(message: string): void;
    showSuccess(message: string): void;
    showInfo(message: string): void;
    showWarning(message: string): void;
}

export const NOTIFICATION_SERVICE = new InjectionToken<NotificationService>('PLATFORM_NOTIFICATION_SERVICE');
