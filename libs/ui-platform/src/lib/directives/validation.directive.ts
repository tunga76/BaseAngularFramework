import { Directive, ElementRef, Renderer2, DoCheck, Self, HostBinding } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[platformValidation]',
    standalone: true
})
export class ValidationDirective implements DoCheck {
    // Option 1: Use HostBinding to toggle class.
    // Option 2: Use Renderer2 if we want to be safe or if HostBinding conflict.

    // We'll use HostBinding for simplicity.
    @HostBinding('class.invalid') isInvalid = false;
    @HostBinding('class.touched') isTouched = false;

    constructor(@Self() private ngControl: NgControl) { }

    ngDoCheck() {
        // Only mark invalid if touched or dirty (standard UX)
        this.isTouched = !!this.ngControl.touched;
        this.isInvalid = !!(this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty));
    }
}
