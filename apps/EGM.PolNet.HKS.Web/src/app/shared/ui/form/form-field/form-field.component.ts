import {
    Component,
    Input,
    ContentChild,
    AfterContentInit,
    Optional
} from '@angular/core';
import { AbstractControl, ControlContainer, NgControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { FormErrorService } from '../errors/form-error.service';
import { FieldRuleContext } from '../models/field-rule.model';
import { FieldRuleService } from '../services/field-rule.service';

@Component({
    selector: 'app-form-field',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './form-field.component.html',
    host: {
        'class': 'block mb-3'
    }
})
export class FormFieldComponent implements AfterContentInit {

    @Input() label!: string;
    @Input() controlName!: string;
    @Input() hint?: string;
    @Input() readonly = false;

    control!: AbstractControl | null;
    isRequired = false;
    isHidden = false;

    @ContentChild(NgControl) ngControl!: NgControl;

    @Input() context!: FieldRuleContext;

    constructor(
        @Optional() private controlContainer: ControlContainer,
        private errorService: FormErrorService,
        private ruleService: FieldRuleService
    ) { }


    ngAfterContentInit(): void {

        if (!this.controlContainer) return;

        this.control = this.controlContainer.control?.get(this.controlName) ?? null;

        if (!this.control) return;

        // Required validator kontrolü
        this.isRequired = this.control.hasValidator?.(Validators.required) ?? false;

        // readonly propagate
        if (this.readonly && this.ngControl?.control) {
            this.ngControl.control.disable({ emitEvent: false });
        }

        const result = this.ruleService.evaluate(
            this.controlName,
            this.context
        );

        if (result.disabled) {
            this.control?.disable({ emitEvent: false });
        }

        if (result.required) {
            this.control?.addValidators(Validators.required);
            this.control?.updateValueAndValidity({ emitEvent: false });
        }

        this.isHidden = result.hidden ?? false;
    }

    get showError(): boolean {
        return !!this.control?.invalid && !!this.control?.touched && !this.control?.pending;
    }

    get showSuccess(): boolean {
        return !!this.control?.valid && !!this.control?.value && !this.control?.pending;
    }

    get showPending(): boolean {
        return !!this.control?.pending;
    }

    get errorMessage(): string {
        return this.errorService.getError(this.control, this.label);
    }


    //     get showError(): boolean {
    //   return !!this.control?.invalid && !!this.control?.touched;
    // }

    // get showSuccess(): boolean {
    //   return !!this.control?.valid && !!this.control?.touched;
    // }

    // get showPending(): boolean {
    //   return !!this.control?.pending;
    // }

    // get errorMessage(): string {
    //   return this.errorService.getError(this.control, this.label);
    // }

}
