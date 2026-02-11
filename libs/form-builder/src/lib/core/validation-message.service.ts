import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ValidationMessageService {
    private messages: Record<string, string | ((args: any) => string)> = {
        required: 'This field is required.',
        email: 'Please enter a valid email address.',
        minlength: (args) => `Minimum length is ${args.requiredLength}.`,
        maxlength: (args) => `Maximum length is ${args.requiredLength}.`,
        min: (args) => `Minimum value is ${args.min}.`,
        max: (args) => `Maximum value is ${args.max}.`,
        tcNo: 'Invalid TC Identity Number.',
        iban: 'Invalid IBAN.',
    };

    getMessage(errorKey: string, errorValue: any): string {
        const message = this.messages[errorKey];
        if (typeof message === 'function') {
            return message(errorValue);
        }
        return message || `Validation error: ${errorKey}`;
    }

    registerMessage(key: string, message: string | ((args: any) => string)): void {
        this.messages[key] = message;
    }
}
