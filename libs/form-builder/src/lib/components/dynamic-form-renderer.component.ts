import { Component, Input, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ValidationRegistryService } from '../core/validation-registry.service';

@Component({
  selector: 'platform-dynamic-form-renderer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDividerModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dynamic-form">
      <div class="form-grid">
        @for (element of processedElements(); track element.key) {
          <div [class]="element.className || 'col-12'">
            
            @switch (element.type) {
              @case ('text') {
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ element.templateOptions.label }}</mat-label>
                  <input matInput [formControlName]="element.key" [placeholder]="element.templateOptions.placeholder || ''">
                  @if (element.templateOptions.description) {
                    <mat-hint>{{ element.templateOptions.description }}</mat-hint>
                  }
                </mat-form-field>
              }

              @case ('password') {
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ element.templateOptions.label }}</mat-label>
                  <input matInput type="password" [formControlName]="element.key">
                </mat-form-field>
              }

              @case ('select') {
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ element.templateOptions.label }}</mat-label>
                  <mat-select [formControlName]="element.key">
                    @for (opt of element.templateOptions.options; track opt.value) {
                      <mat-option [value]="opt.value">{{ opt.label }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
              }

              @case ('date') {
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ element.templateOptions.label }}</mat-label>
                  <input matInput [matDatepicker]="picker" [formControlName]="element.key">
                  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>
              }

              @case ('checkbox') {
                <div class="checkbox-container">
                  <mat-checkbox [formControlName]="element.key">
                    {{ element.templateOptions.label }}
                  </mat-checkbox>
                </div>
              }

              @case ('divider') {
                <mat-divider class="form-divider"></mat-divider>
              }
            }

          </div>
        }
      </div>

      <div class="form-actions" *ngIf="processedElements().length">
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          Submit Form
        </button>
        <button mat-button type="button" (click)="form.reset()">
          Reset
        </button>
      </div>
    </form>
  `,
  styles: [`
    .dynamic-form {
      padding: 20px;
      background: #fff;
      border-radius: 8px;
    }
    .form-grid {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -10px;
    }
    .full-width {
      width: 100%;
    }
    .col-12 { width: 100%; padding: 0 10px; }
    .col-md-6 { width: 50%; padding: 0 10px; }
    /* Bootstrap-like grid helpers for demo */
    .col-lg-6 { width: 50%; padding: 0 10px; }
    
    @media (max-width: 768px) {
      .col-md-6, .col-lg-6 { width: 100%; }
    }

    .checkbox-container {
      padding: 10px 0;
    }
    .form-divider {
      margin: 20px 0;
    }
    .form-actions {
      margin-top: 30px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
  `]
})
export class DynamicFormRendererComponent implements OnInit {
  @Input() schema: any;

  private fb = inject(FormBuilder);
  private validationRegistry = inject(ValidationRegistryService);

  form: FormGroup = this.fb.group({});

  ngOnInit() {
    if (this.schema) {
      this.buildForm();
    }
  }

  readonly processedElements = computed(() => {
    if (!this.schema) return [];

    // If it's internal builder format (has fields)
    if (this.schema.fields && Array.isArray(this.schema.fields)) {
      return this.schema.fields.map((f: any) => ({
        key: f.name,
        type: f.type,
        templateOptions: {
          label: f.label,
          placeholder: f.ui?.placeholder,
          description: f.ui?.hint,
          options: f.options,
          required: f.validators?.some((v: any) => v.type === 'required')
        },
        className: `col-md-${f.ui?.colSpan?.md || 12}`,
        defaultValue: f.defaultValue,
        validators: f.validators
      }));
    }

    // Traditional engine format
    return this.schema.elements || [];
  });

  private buildForm() {
    const group: any = {};
    this.processedElements().forEach((el: any) => {
      if (el.type === 'divider') return;

      const validators = [];

      // Handle templateOptions.required (legacy/shorthand support)
      if (el.templateOptions?.required) {
        validators.push(Validators.required);
      }

      // Handle dynamic validators from schema
      // Case 1: Engine format { validation: ['required', 'email'] }
      if (el.validators && typeof el.validators === 'object' && 'validation' in el.validators) {
        const validationList = el.validators.validation as string[];
        validationList.forEach((vName: string) => {
          const v = this.validationRegistry.getValidator(vName);
          if (v) validators.push(v);
        });
      }

      // Case 2: Builder format [{ type: 'minLength', value: 5 }] or custom ones
      if (Array.isArray(el.validators)) {
        el.validators.forEach((vConfig: any) => {
          const v = this.validationRegistry.getValidator(vConfig.type, vConfig.value);
          if (v) validators.push(v);
        });
      }

      group[el.key] = [el.defaultValue || '', validators];
    });
    this.form = this.fb.group(group);
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Submitted!', this.form.value);
      alert('Form Data:\n' + JSON.stringify(this.form.value, null, 2));
    }
  }
}
