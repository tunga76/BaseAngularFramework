import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormFieldSchema } from '../../core/form-schema.model';
import { DynamicField } from '../../core/dynamic-field.interface';
import { ValidationMessageService } from '../../core/validation-message.service';

@Component({
    selector: 'lib-material-select',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
    template: `
    <mat-form-field [formGroup]="group" class="w-full">
      <mat-label>{{ config.label }}</mat-label>
      <mat-select [formControlName]="config.name">
        @for (option of config.options; track option.value) {
          <mat-option [value]="option.value">{{ option.label }}</mat-option>
        }
      </mat-select>

      @if (control?.invalid && (control?.dirty || control?.touched)) {
        <mat-error>{{ getErrorMessage() }}</mat-error>
      }
    </mat-form-field>
  `,
    styles: [`:host { display: block; width: 100%; margin-bottom: 1rem; } .w-full { width: 100%; }`]
})
export class MaterialSelectComponent implements DynamicField {
    @Input() group!: FormGroup;
    @Input() config!: FormFieldSchema;

    private validationService = inject(ValidationMessageService);

    get control() { return this.group.get(this.config.name); }

    getErrorMessage(): string {
        const errors = this.control?.errors;
        if (!errors) return '';
        const firstKey = Object.keys(errors)[0];
        return this.validationService.getMessage(firstKey, errors[firstKey]);
    }
}
