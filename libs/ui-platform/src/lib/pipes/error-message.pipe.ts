import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
    name: 'errorMessage',
    standalone: true
})
export class ErrorMessagePipe implements PipeTransform {
    // Map of default error messages. Can be extended via DI or inputs if needed.
    private defaultMessages: Record<string, Function> = {
        required: () => 'This field is required',
        email: () => 'Please enter a valid email address',
        minlength: (params: any) => `Minimum length is ${params.requiredLength}`,
        maxlength: (params: any) => `Maximum length is ${params.requiredLength}`,
        pattern: () => 'Invalid format',
        min: (params: any) => `Minimum value is ${params.min}`,
        max: (params: any) => `Maximum value is ${params.max}`
    };

    transform(errors: ValidationErrors | null | undefined, customMessages?: Record<string, string>): string {
        if (!errors) return '';

        // Prioritize errors? usually just take the first one.
        const errorKey = Object.keys(errors)[0];
        if (!errorKey) return '';

        const errorValue = errors[errorKey];

        // Check custom messages first
        if (customMessages && customMessages[errorKey]) {
            return customMessages[errorKey];
        }

        // Check default messages
        if (this.defaultMessages[errorKey]) {
            return this.defaultMessages[errorKey](errorValue);
        }

        return 'Invalid field';
    }
}
