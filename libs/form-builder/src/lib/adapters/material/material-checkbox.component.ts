import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormFieldSchema } from '../../core/form-schema.model';
import { DynamicField } from '../../core/dynamic-field.interface';
import { ValidationMessageService } from '../../core/validation-message.service';

@Component({
    selector: 'lib-material-checkbox',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatCheckboxModule, MatFormFieldModule],
    template: `
    <div [formGroup]="group" class="checkbox-wrapper">
      <mat-checkbox [formControlName]="config.name" [color]="'primary'">
        {{ config.label }}
      </mat-checkbox>
      
      @if (control?.invalid && (control?.dirty || control?.touched)) {
        <mat-error class="text-sm text-red-600 block mt-1">{{ getErrorMessage() }}</mat-error>
      }
    </div>
  `,
    styles: [`
    :host { display: block; margin-bottom: 1rem; }
    .checkbox-wrapper { display: flex; flex-direction: column; }
    mat-error { font-size: 0.75rem; margin-top: 4px; }
  `]
})
export class MaterialCheckboxComponent implements DynamicField {
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
