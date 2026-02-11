import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, FormSchema } from '@platform/form-builder';

@Component({
    selector: 'app-kitchen-sink',
    standalone: true,
    imports: [CommonModule, DynamicFormComponent],
    template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">Kitchen Sink (All Field Types)</h2>
      <lib-dynamic-form [schema]="schema" (formSubmit)="onSubmit($event)"></lib-dynamic-form>
      
      @if (data) {
        <pre class="mt-4 bg-gray-100 p-2 rounded">{{ data | json }}</pre>
      }
    </div>
  `
})
export class KitchenSinkComponent {
    data: any;

    schema: FormSchema = {
        fields: [
            { name: 'textField', type: 'text', label: 'Text Field' },
            { name: 'numberField', type: 'number', label: 'Number Field' },
            { name: 'emailField', type: 'email' as any, label: 'Email Field' },
            {
                name: 'selectField',
                type: 'select',
                label: 'Select Field',
                options: [
                    { label: 'Option A', value: 'a' },
                    { label: 'Option B', value: 'b' }
                ],
                visibleWhen: [
                    {
                        dependsOn: 'textField',
                        operator: 'eq',
                        value: 'a',
                    }
                ],
                validators: [
                    {
                        name: 'required',
                        message: 'This field is required',
                    }
                ]
            },
            { name: 'dateField', type: 'date', label: 'Date Field' },
            { name: 'checkboxField', type: 'checkbox', label: 'Checkbox Field' }
        ]
    };

    onSubmit(val: any) {
        this.data = val;
    }
}
