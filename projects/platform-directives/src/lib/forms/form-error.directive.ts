import { Directive, Input, inject, ElementRef, Renderer2, OnInit, OnDestroy, effect, signal } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Directive to display standardized error messages for a form control.
 * Usage: <span appFormError="email"></span>
 */
@Directive({
    selector: '[appFormError]',
    standalone: true,
})
export class FormErrorDirective implements OnInit {
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);
    private controlContainer = inject(ControlContainer, { optional: true });
    private destroyRef = inject(DestroyRef);

    @Input('appFormError') controlName!: string;

    ngOnInit() {
        if (!this.controlContainer || !this.controlContainer.control) {
            console.warn('appFormError: No parent form group found');
            return;
        }

        const formGroup = this.controlContainer.control as FormGroup;
        const control = formGroup.get(this.controlName);

        if (control) {
            // Listen to status changes to show/hide errors
            control.statusChanges
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => {
                    this.updateErrorMessage(control);
                });

            // Initial check
            this.updateErrorMessage(control);
        }
    }

    private updateErrorMessage(control: any) {
        if (control.errors && (control.touched || control.dirty)) {
            const errorKey = Object.keys(control.errors)[0];
            const message = this.getErrorPrompt(errorKey, control.errors[errorKey]);
            this.renderer.setProperty(this.el.nativeElement, 'innerText', message);
            this.renderer.setStyle(this.el.nativeElement, 'display', 'inline');
        } else {
            this.renderer.setProperty(this.el.nativeElement, 'innerText', '');
            this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
        }
    }

    private getErrorPrompt(key: string, errorData: any): string {
        const errorMap: Record<string, (data: any) => string> = {
            required: () => 'This field is required',
            email: () => 'Invalid email address',
            minlength: (data) => `Minimum length is ${data.requiredLength}`,
            maxlength: (data) => `Maximum length is ${data.requiredLength}`,
            pattern: () => 'Invalid format',
            numeric: () => 'Only numbers allowed',
        };

        return errorMap[key] ? errorMap[key](errorData) : `Error: ${key}`;
    }
}
