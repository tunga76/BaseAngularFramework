import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormFieldSchema } from '../../core/form-schema.model';
import { DynamicField } from '../../core/dynamic-field.interface';
import { ValidationMessageService } from '../../core/validation-message.service';

@Component({
    selector: 'lib-material-datepicker',
    standalone: true,
    providers: [provideNativeDateAdapter()],
    imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatInputModule, MatFormFieldModule],
    template: `
    <mat-form-field [formGroup]="group" class="w-full">
      <mat-label>{{ config.label }}</mat-label>
      <input matInput [matDatepicker]="picker" [formControlName]="config.name" [placeholder]="config.placeholder || ''">
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
      
      @if (control?.invalid && (control?.dirty || control?.touched)) {
        <mat-error>{{ getErrorMessage() }}</mat-error>
      }
    </mat-form-field>
  `,
    styles: [`:host { display: block; width: 100%; margin-bottom: 1rem; } .w-full { width: 100%; }`]
})
export class MaterialDatepickerComponent implements DynamicField {
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
