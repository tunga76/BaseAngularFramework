import { AbstractControl, ValidationErrors } from '@angular/forms';

export function rfMatchValidator(
    controlName: string,
    rfControlName: string
) {
    return (group: AbstractControl): ValidationErrors | null => {

        const control = group.get(controlName);
        const rfControl = group.get(rfControlName);

        if (!control || !rfControl) return null;

        if (control.value && rfControl.value && control.value !== rfControl.value) {
            control.setErrors({
                ...(control.errors ?? {}),
                rfMismatch: true
            });
            return { rfMismatch: true };
        }

        return null;
    };
}
