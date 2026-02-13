import { Directive, ElementRef, Input } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Directive({
    selector: '[validationMessage]',
    standalone: true
})
export class ValidationMessageDirective {
    @Input('validationMessage') control!: AbstractControl | null;

    constructor(private el: ElementRef) { }

    ngOnChanges() {
        if (!this.control) return;
        const errors = this.control.errors;
        if (errors?.['required']) {
            this.el.nativeElement.innerText = 'Bu alan zorunludur.';
        } else if (errors?.['minlength']) {
            this.el.nativeElement.innerText = 'En az 2 karakter olmalı.';
        } else if (errors?.['forbiddenChars']) {
            this.el.nativeElement.innerText = 'İzin verilmeyen karakter var.';
        } else {
            this.el.nativeElement.innerText = '';
        }
    }
}
