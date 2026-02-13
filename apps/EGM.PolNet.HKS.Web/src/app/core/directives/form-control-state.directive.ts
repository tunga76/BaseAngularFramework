import {
    Directive,
    Input,
    OnInit,
    Optional,
    HostBinding
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appFormControlState]',
    standalone: true
})
export class FormControlStateDirective implements OnInit {

    @HostBinding('class.is-invalid') isInvalid = false;
    @HostBinding('class.is-valid') isValid = false;

    constructor(@Optional() private ngControl: NgControl) { }

    ngOnInit(): void {
        if (!this.ngControl) return;

        this.ngControl.statusChanges?.subscribe(() => {
            const control = this.ngControl.control;
            if (!control) return;

            this.isInvalid = control.invalid && control.touched;
            this.isValid = control.valid && !!control.value;
        });
    }
}
