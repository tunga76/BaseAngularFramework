import { EnvironmentProviders, makeEnvironmentProviders, Type } from '@angular/core';
import { ConfirmService, AlertService, ToastService, SpinnerService } from './ui-interfaces';
import { PlatformUiService } from './platform-ui.service';
import { NgxSpinnerImplService } from './ngx-spinner-impl.service';

export interface UiFeedbackConfig {
    confirmService?: Type<ConfirmService>;
    alertService?: Type<AlertService>;
    toastService?: Type<ToastService>;
    spinnerService?: Type<SpinnerService>;
}

export function provideUiFeedback(config: UiFeedbackConfig = {}): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: ConfirmService, useClass: config.confirmService || PlatformUiService },
        { provide: AlertService, useClass: config.alertService || PlatformUiService },
        { provide: ToastService, useClass: config.toastService || PlatformUiService },
        { provide: SpinnerService, useClass: config.spinnerService || NgxSpinnerImplService },
    ]);
}
