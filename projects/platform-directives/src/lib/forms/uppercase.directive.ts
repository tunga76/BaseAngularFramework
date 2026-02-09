import { Directive, HostListener, inject, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Directive to transform form control value to uppercase.
 * Usage: <input type="text" appUppercase>
 */
@Directive({
    selector: 'input[appUppercase]',
    standalone: true,
})
export class UppercaseDirective {
    private el = inject(ElementRef);
    private control = inject(NgControl, { optional: true });

    @HostListener('input')
    onInput() {
        const value = this.el.nativeElement.value;
        if (value) {
            const upper = value.toUpperCase();
            this.el.nativeElement.value = upper;

            if (this.control && this.control.control) {
                this.control.control.setValue(upper, { emitEvent: false });
            }
        }
    }
}
