import { InjectionToken } from '@angular/core';

/**
 * Translation strings for UI Feedback library.
 */
export interface UiFeedbackTranslations {
    confirm: string;
    cancel: string;
    ok: string;
    close: string;
    success: string;
    error: string;
    warning: string;
    info: string;
}

/**
 * Injection token for UI Feedback translations.
 */
export const UI_FEEDBACK_TRANSLATIONS = new InjectionToken<UiFeedbackTranslations>(
    'UI_FEEDBACK_TRANSLATIONS'
);

/**
 * Default English translations.
 */
export const DEFAULT_EN_TRANSLATIONS: UiFeedbackTranslations = {
    confirm: 'Confirm',
    cancel: 'Cancel',
    ok: 'OK',
    close: 'Close',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
};

/**
 * Turkish translations.
 */
export const TR_TRANSLATIONS: UiFeedbackTranslations = {
    confirm: 'Onayla',
    cancel: 'İptal',
    ok: 'Tamam',
    close: 'Kapat',
    success: 'Başarılı',
    error: 'Hata',
    warning: 'Uyarı',
    info: 'Bilgi',
};
