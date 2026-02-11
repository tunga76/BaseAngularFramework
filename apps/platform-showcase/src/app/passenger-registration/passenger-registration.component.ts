import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '@platform/form-builder';
import { FormSchema, FormFieldType } from '@platform/form-builder';
import { provideMaterialFormAdapters } from '@platform/form-builder';
import { tcNoValidator } from '@platform/form-builder';
import { FormBuilderService } from '@platform/form-builder';

@Component({
  selector: 'app-passenger-registration-showcase',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  providers: [provideMaterialFormAdapters()],
  template: `
    <div class="p-4 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Passenger Registration</h1>
      <lib-dynamic-form [schema]="formSchema" (formSubmit)="onSubmit($event)"></lib-dynamic-form>
      
      @if (submittedData) {
        <div class="mt-4 p-4 bg-gray-100 rounded">
          <h2 class="font-bold">Submitted Data:</h2>
          <pre>{{ submittedData | json }}</pre>
        </div>
      }
    </div>
  `
})
export class PassengerRegistrationComponent {
  submittedData: any;

  constructor() {
    const fbService = inject(FormBuilderService);
    // Register custom validator
    fbService.registerValidator('tcNo', () => tcNoValidator());
  }

  formSchema: FormSchema = {
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        validators: [{ name: 'required' }, { name: 'minLength', args: { requiredLength: 2 } }]
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        validators: [{ name: 'required' }]
      },
      {
        name: 'tcNo',
        label: 'TC Identity Number',
        type: 'text',
        validators: [{ name: 'required' }, { name: 'tcNo' }]
      },
      {
        name: 'birthDate',
        label: 'Birth Date',
        type: 'date',
        validators: [{ name: 'required' }]
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        options: [
          { label: 'Male', value: 'M' },
          { label: 'Female', value: 'F' },
          { label: 'Other', value: 'O' }
        ]
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email' as FormFieldType,
        validators: [{ name: 'email' }]
      },
      {
        name: 'hasPassport',
        label: 'Do you have a Passport?',
        type: 'checkbox',
        defaultValue: false
      },
      {
        name: 'passportNo',
        label: 'Passport Number',
        type: 'text',
        visibleWhen: [{ dependsOn: 'hasPassport', value: true }],
        validators: [{ name: 'required' }]
      }
    ]
  };

  onSubmit(data: any) {
    console.log('Form Submitted:', data);
    this.submittedData = data;
  }
}
