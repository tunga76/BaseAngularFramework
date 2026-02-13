import { Directive, ElementRef, Input } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Directive({
    selector: '[appFormState]',
    standalone: true
})
export class FormStateDirective {

    @Input('appFormState') control!: AbstractControl | null;

    constructor(private el: ElementRef) { }

    ngDoCheck() {
        if (!this.control) return;

        const element = this.el.nativeElement;

        element.classList.remove('is-valid', 'is-invalid');

        if (this.control.invalid && this.control.touched) {
            element.classList.add('is-invalid');
        }

        if (this.control.valid && this.control.touched) {
            element.classList.add('is-valid');
        }
    }
}
