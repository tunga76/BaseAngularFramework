import { Component, Input, Output, EventEmitter, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormSchema, FormFieldSchema } from '../core/form-schema.model';
import { FormBuilderService } from '../core/form-builder.service';
import { FormControlRegistry } from '../core/form-control-registry';
import { FormStore } from '../store/form.store';
import { BackendValidationMapper } from '../integration/backend-validation.mapper';

@Component({
    selector: 'lib-dynamic-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    providers: [FormStore],
    template: `
    @if (form) {
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        @for (field of fields(); track field.name) {
          @if (isFieldVisible(field)) {
             <div class="mb-4">
              <ng-container *ngComponentOutlet="getComponent(field.type); inputs: { group: form, config: field }">
              </ng-container>
            </div>
          }
        }

        <div class="form-actions mt-4">
           @if (store.loading()) {
             <span>Loading...</span>
           } @else {
             <button type="submit" [disabled]="form.invalid || form.pristine">Submit</button>
           }
        </div>
        
        @if (store.backendErrors()) {
           <div class="backend-errors text-red-600 mt-4">
               Please correct the errors above.
           </div>
        }
      </form>
    }
  `
})
export class DynamicFormComponent implements OnInit {
    @Input() schema!: FormSchema;
    @Input() initialData: any;
    @Output() formSubmit = new EventEmitter<any>();

    form!: FormGroup;

    private fbService = inject(FormBuilderService);
    private registry = inject(FormControlRegistry);
    public store = inject(FormStore);
    private backendMapper = inject(BackendValidationMapper);

    private formValue = signal<any>({});
    fields = signal<FormFieldSchema[]>([]);

    constructor() { }

    ngOnInit() {
        if (this.schema) {
            this.fields.set(this.schema.fields);
            this.form = this.fbService.buildForm(this.schema);

            if (this.initialData) {
                this.form.patchValue(this.initialData);
                this.formValue.set(this.form.value);
            }

            this.form.valueChanges.subscribe(val => {
                this.formValue.set(val);
                this.updateControlStatus(val);
            });

            this.formValue.set(this.form.value);
            this.updateControlStatus(this.form.value);
        }
    }

    updateControlStatus(formValue: any) {
        if (!this.schema || !this.schema.fields) return;

        this.schema.fields.forEach(field => {
            if (!field.visibleWhen) return;

            const isVisible = this.checkVisibility(field, formValue);
            const control = this.form.get(field.name);

            if (!control) return;

            if (isVisible && control.disabled && !Boolean(field.disabled)) {
                control.enable({ emitEvent: false });
            } else if (!isVisible && control.enabled) {
                control.disable({ emitEvent: false });
            }
        });
    }


    getComponent(type: string) {
        return this.registry.getComponent(type) || null;
    }

    checkVisibility(field: FormFieldSchema, formValue: any): boolean {
        if (!field.visibleWhen || field.visibleWhen.length === 0) {
            return true;
        }
        return field.visibleWhen.every(rule => {
            const dependentValue = formValue[rule.dependsOn];
            if (rule.operator === 'neq') return dependentValue !== rule.value;
            // Add other operators...
            return dependentValue === rule.value;
        });
    }

    isFieldVisible(field: FormFieldSchema): boolean {
        return this.checkVisibility(field, this.formValue());
    }

    onSubmit() {
        if (this.form.valid) {
            this.store.setSubmitting(true);
            this.formSubmit.emit(this.form.value);
        } else {
            this.form.markAllAsTouched();
        }
    }
}
