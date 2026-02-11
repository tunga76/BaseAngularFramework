import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormFieldSchema } from '../../core/form-schema.model';
import { DynamicField } from '../../core/dynamic-field.interface';
import { ValidationMessageService } from '../../core/validation-message.service';

@Component({
    selector: 'lib-material-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
    template: `
    <mat-form-field [formGroup]="group" class="w-full">
      <mat-label>{{ config.label }}</mat-label>
      <input matInput [type]="config.type" [placeholder]="config.placeholder || ''" [formControlName]="config.name">
      
      @if (control?.invalid && (control?.dirty || control?.touched)) {
        <mat-error>
          {{ getErrorMessage() }}
        </mat-error>
      }
    </mat-form-field>
  `,
    styles: [`
    :host { display: block; width: 100%; margin-bottom: 1rem; }
    .w-full { width: 100%; }
  `]
})
export class MaterialInputComponent implements DynamicField {
    @Input() group!: FormGroup;
    @Input() config!: FormFieldSchema;

    private validationService = inject(ValidationMessageService);

    get control() {
        return this.group.get(this.config.name);
    }

    getErrorMessage(): string {
        const errors = this.control?.errors;
        if (!errors) return '';
        const firstKey = Object.keys(errors)[0];
        return this.validationService.getMessage(firstKey, errors[firstKey]);
    }
}
