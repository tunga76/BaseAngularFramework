import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface BackendErrorResponse {
    errors: Record<string, string[]>;
}

@Injectable({ providedIn: 'root' })
export class BackendValidationMapper {
    applyErrors(form: FormGroup, errorResponse: BackendErrorResponse): void {
        if (!errorResponse || !errorResponse.errors) return;

        Object.keys(errorResponse.errors).forEach(key => {
            const control = form.get(key);
            if (control) {
                const messages = errorResponse.errors[key];
                // Set the error on the control. We use a specific key 'backend' or just set the whole object.
                // Here we set a specific 'serverError' error with the message.
                control.setErrors({
                    serverError: messages.join(' '),
                    ...control.errors
                });
                control.markAsTouched();
            }
        });
    }

    clearErrors(form: FormGroup): void {
        Object.keys(form.controls).forEach(key => {
            const control = form.get(key);
            if (control) {
                // Remove serverError if it exists
                if (control.errors && control.errors['serverError']) {
                    const { serverError, ...otherErrors } = control.errors;
                    control.setErrors(Object.keys(otherErrors).length > 0 ? otherErrors : null);
                }
            }
        });
    }
}
