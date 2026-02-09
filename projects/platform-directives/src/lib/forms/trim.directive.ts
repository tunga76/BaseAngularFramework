import { Directive, HostListener, inject, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Directive to trim form control value on blur.
 * Usage: <input type="text" appTrim formControlName="name">
 */
@Directive({
    selector: 'input[appTrim], textarea[appTrim]',
    standalone: true,
})
export class TrimDirective {
    private el = inject(ElementRef);
    private control = inject(NgControl, { optional: true });

    @HostListener('blur')
    onBlur() {
        const value = this.el.nativeElement.value;
        if (value && typeof value === 'string') {
            const trimmed = value.trim();
            this.el.nativeElement.value = trimmed;

            if (this.control && this.control.control) {
                this.control.control.setValue(trimmed, { emitEvent: true });
            }
        }
    }
}
