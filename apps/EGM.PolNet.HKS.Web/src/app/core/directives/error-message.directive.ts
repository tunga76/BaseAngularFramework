import {
    Directive,
    Input,
    OnInit,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Directive({
    selector: '[appErrorMessage]',
    standalone: true
})
export class ErrorMessageDirective implements OnInit {

    @Input('appErrorMessage') controlName!: string;

    constructor(
        private templateRef: TemplateRef<any>,
        private vcr: ViewContainerRef,
        private controlContainer: ControlContainer
    ) { }

    ngOnInit(): void {
        const control = this.controlContainer.control?.get(this.controlName);
        if (!control) return;

        control.statusChanges?.subscribe(() => {
            this.vcr.clear();

            if (control.invalid && control.touched) {
                const error = this.getErrorMessage(control.errors);
                this.vcr.createEmbeddedView(this.templateRef, { $implicit: error });
            }
        });
    }

    private getErrorMessage(errors: any): string {
        if (errors?.required) return 'Bu alan zorunludur';
        if (errors?.minlength) return 'Minimum karakter sayısı sağlanmadı';
        if (errors?.maxlength) return 'Maksimum karakter aşıldı';
        return 'Geçersiz alan';
    }
}
