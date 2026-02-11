import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, FormSchema } from '@platform/form-builder';

@Component({
    selector: 'app-conditional-logic',
    standalone: true,
    imports: [CommonModule, DynamicFormComponent],
    template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">Conditional Logic Test</h2>
      <lib-dynamic-form [schema]="schema" (formSubmit)="onSubmit($event)"></lib-dynamic-form>
      @if (data) {
        <pre class="mt-4 bg-gray-100 p-2 rounded">{{ data | json }}</pre>
      }
    </div>
  `
})
export class ConditionalLogicComponent {
    data: any;

    schema: FormSchema = {
        fields: [
            {
                name: 'subscriptionType',
                type: 'select',
                label: 'Subscription Type',
                options: [
                    { label: 'Free', value: 'free' },
                    { label: 'Premium', value: 'premium' },
                    { label: 'Enterprise', value: 'enterprise' }
                ]
            },
            {
                name: 'promoCode',
                label: 'Promo Code',
                type: 'text',
                visibleWhen: [{ dependsOn: 'subscriptionType', value: 'premium' }]
            },
            {
                name: 'taxId',
                label: 'Tax ID',
                type: 'text',
                visibleWhen: [{ dependsOn: 'subscriptionType', value: 'enterprise' }]
            },
            {
                name: 'newsletter',
                label: 'Subscribe to newsletter?',
                type: 'checkbox'
            },
            {
                name: 'frequency',
                label: 'Frequency',
                type: 'select',
                options: [{ label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }],
                visibleWhen: [{ dependsOn: 'newsletter', value: true }]
            }
        ]
    };

    onSubmit(val: any) {
        this.data = val;
    }
}
