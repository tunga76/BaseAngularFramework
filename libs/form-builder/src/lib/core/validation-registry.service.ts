import { Injectable } from '@angular/core';
import { ValidatorFn, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ValidationRegistryService {
    private customValidators = new Map<string, (config?: any) => ValidatorFn>();

    constructor() {
        this.registerStandardValidators();
    }

    register(name: string, factory: (config?: any) => ValidatorFn) {
        this.customValidators.set(name, factory);
    }

    getValidator(name: string, config?: any): ValidatorFn | null {
        // Check standard Angular validators first
        if (name === 'required') return Validators.required;
        if (name === 'email') return Validators.email;
        if (name === 'min') return Validators.min(config);
        if (name === 'max') return Validators.max(config);
        if (name === 'minLength') return Validators.minLength(config);
        if (name === 'maxLength') return Validators.maxLength(config);
        if (name === 'pattern') return Validators.pattern(config);

        // Check custom ones
        const factory = this.customValidators.get(name);
        return factory ? factory(config) : null;
    }

    private registerStandardValidators() {
        // Example: Custom validator for T.C. Kimlik No (Turkish Identity Number)
        this.register('tcNo', () => (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null;
            const isValid = /^[1-9][0-9]{10}$/.test(value); // Simplified for example
            return isValid ? null : { tcNo: true };
        });

        // Example: Only numeric values
        this.register('numeric', () => (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null;
            return /^\d+$/.test(value) ? null : { numeric: true };
        });
    }
}
