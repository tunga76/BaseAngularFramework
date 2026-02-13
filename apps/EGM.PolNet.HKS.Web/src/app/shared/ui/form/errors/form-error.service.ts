import { Inject, Injectable, Optional } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FORM_ERROR_CONFIG, FormErrorConfig } from './form-error.token';

@Injectable({ providedIn: 'root' })
export class FormErrorService {

    constructor(
        @Optional() @Inject(FORM_ERROR_CONFIG)
        private config: FormErrorConfig
    ) { }

    getError(control: AbstractControl | null, label?: string): string {

        if (!control || !control.errors) return '';

        const firstKey = Object.keys(control.errors)[0];
        const errorValue = control.errors[firstKey];

        const resolver = this.config?.[firstKey];

        if (resolver) {
            return resolver(errorValue, label);
        }

        return 'Geçersiz alan';
    }
}
