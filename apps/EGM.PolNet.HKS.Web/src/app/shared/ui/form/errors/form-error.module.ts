import { Provider } from '@angular/core';
import { FORM_ERROR_CONFIG, FormErrorConfig } from './form-error.token';

// export const defaultFormErrorConfig: FormErrorConfig = {
//     required: (_, label) => `${label ?? 'Bu alan'} zorunludur`,
//     minlength: (err, label) =>
//         `${label ?? 'Bu alan'} en az ${err.requiredLength} karakter olmalıdır`,
//     maxlength: (err, label) =>
//         `${label ?? 'Bu alan'} en fazla ${err.requiredLength} karakter olabilir`,
//     email: () => `Geçerli bir email giriniz`,
//     seriNoTaken: () => `Bu seri numarası zaten kullanılmış`,
//     pattern: () => `Geçersiz format`
// };

export const defaultFormErrorConfig: FormErrorConfig = {
    required: (_, label) => `${label} zorunludur`,
    minlength: (err, label) =>
        `${label} en az ${err.requiredLength} karakter olmalıdır`,
    forbiddenChars: (_, label) =>
        `${label} alanında izin verilmeyen karakter olmamalıdır`,
    onlyLetters: (_, label) =>
        `${label} alanında alfanümerik karakter olmamalıdır`,
    rfMismatch: () => `Rf Id değeri ile aynı değil`,
    maxlength: (err, label) =>
        `${label} en fazla ${err.requiredLength} karakter olabilir`,
    email: () => `Geçerli bir email giriniz`,
    seriNoTaken: () => `Bu seri numarası zaten kullanılmış`,
    pattern: () => `Geçersiz format`
};


export const provideFormErrors: Provider = {
    provide: FORM_ERROR_CONFIG,
    useValue: defaultFormErrorConfig
};
