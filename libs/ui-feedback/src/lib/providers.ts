import { EnvironmentProviders, makeEnvironmentProviders, Type } from '@angular/core';
import { ConfirmService, AlertService, ToastService, SpinnerService } from './ui-interfaces';
import { PlatformUiService } from './platform-ui.service';
import { NgxSpinnerImplService } from './ngx-spinner-impl.service';
import { UiSanitizerService } from './security/ui-sanitizer.service';
import { UiLoggerService } from './logging/ui-logger.service';
import {
    UiFeedbackGlobalConfig,
    UI_FEEDBACK_CONFIG,
    DEFAULT_UI_FEEDBACK_CONFIG
} from './config/ui-config.interface';
import {
    UiFeedbackTranslations,
    UI_FEEDBACK_TRANSLATIONS,
    DEFAULT_EN_TRANSLATIONS
} from './i18n/ui-i18n.interface';

export interface UiFeedbackConfig {
    confirmService?: Type<ConfirmService>;
    alertService?: Type<AlertService>;
    toastService?: Type<ToastService>;
    spinnerService?: Type<SpinnerService>;
}

/**
 * Provides UI Feedback services with optional global configuration and i18n support.
 * 
 * @param config - Service implementation overrides
 * @param globalConfig - Global configuration for dialogs, toasts, and security
 * @param translations - Translation strings for i18n support
 * 
 * @example
 * ```typescript
 * // Basic usage with defaults
 * export const appConfig = {
 *   providers: [provideUiFeedback()]
 * };
 * 
 * // With Material UI and Turkish translations
 * export const appConfig = {
 *   providers: [
 *     provideUiFeedback(
 *       {
 *         confirmService: MaterialUiService,
 *         alertService: MaterialUiService,
 *         toastService: MaterialUiService
 *       },
 *       {
 *         security: { sanitizeHtml: true },
 *         toast: { defaultDuration: 5000 }
 *       },
 *       TR_TRANSLATIONS
 *     )
 *   ]
 * };
 * ```
 */
export function provideUiFeedback(
    config: UiFeedbackConfig = {},
    globalConfig?: UiFeedbackGlobalConfig,
    translations?: UiFeedbackTranslations
): EnvironmentProviders {
    return makeEnvironmentProviders([
        // Configuration and i18n
        {
            provide: UI_FEEDBACK_CONFIG,
            useValue: globalConfig || DEFAULT_UI_FEEDBACK_CONFIG
        },
        {
            provide: UI_FEEDBACK_TRANSLATIONS,
            useValue: translations || DEFAULT_EN_TRANSLATIONS
        },

        // Core services
        UiSanitizerService,
        UiLoggerService,

        // UI services (can be overridden)
        { provide: ConfirmService, useClass: config.confirmService || PlatformUiService },
        { provide: AlertService, useClass: config.alertService || PlatformUiService },
        { provide: ToastService, useClass: config.toastService || PlatformUiService },
        { provide: SpinnerService, useClass: config.spinnerService || NgxSpinnerImplService },
    ]);
}
