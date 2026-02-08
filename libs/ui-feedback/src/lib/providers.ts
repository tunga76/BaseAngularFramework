import { EnvironmentProviders, makeEnvironmentProviders, Type } from '@angular/core';
import { ConfirmService, AlertService, ToastService } from './ui-interfaces';
import { BrowserConfirmService, BrowserAlertService } from './browser-adapters';

export interface UiFeedbackConfig {
    confirmService?: Type<ConfirmService>;
    alertService?: Type<AlertService>;
    toastService?: Type<ToastService>;
}

export function provideUiFeedback(config: UiFeedbackConfig = {}): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: ConfirmService, useClass: config.confirmService || BrowserConfirmService },
        { provide: AlertService, useClass: config.alertService || BrowserAlertService },
        // ToastService might be optional or have no default browser equivalent other than alert
    ]);
}
