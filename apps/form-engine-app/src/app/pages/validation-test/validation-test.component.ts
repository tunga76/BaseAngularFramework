import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, FormSchema, FormBuilderService, tcNoValidator } from '@platform/form-builder';

@Component({
    selector: 'app-validation-test',
    standalone: true,
    imports: [CommonModule, DynamicFormComponent],
    template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">Validation Test</h2>
      <lib-dynamic-form [schema]="schema" (formSubmit)="onSubmit($event)"></lib-dynamic-form>
      @if (data) {
        <pre class="mt-4 bg-gray-100 p-2 rounded">{{ data | json }}</pre>
      }
    </div>
  `
})
export class ValidationTestComponent {
    data: any;

    constructor() {
        const fb = inject(FormBuilderService);
        fb.registerValidator('tcNo', () => tcNoValidator());
    }

    schema: FormSchema = {
        fields: [
            {
                name: 'requiredField',
                label: 'Required Field',
                type: 'text',
                validators: [{ name: 'required' }]
            },
            {
                name: 'emailField',
                label: 'Email (Built-in)',
                type: 'text', // Using text for email validation check
                validators: [{ name: 'required' }, { name: 'email' }]
            },
            {
                name: 'minLengthField',
                label: 'Min Length (3)',
                type: 'text',
                validators: [{ name: 'minLength', args: 3 }]
            },
            {
                name: 'tcNoField',
                label: 'TC No (Custom)',
                type: 'text',
                validators: [{ name: 'required' }, { name: 'tcNo' }]
            }
        ]
    };

    onSubmit(val: any) {
        this.data = val;
    }
}
