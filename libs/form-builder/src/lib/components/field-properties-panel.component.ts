import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { BuilderStateService } from '../core/builder-state.service';
import { BuilderField } from '../models';

@Component({
  selector: 'platform-field-properties-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="properties-container">
      @if (state.selectedField(); as field) {
        <div class="panel-header">
          <mat-icon>{{ getIcon(field.type) }}</mat-icon>
          <h3>Field Properties</h3>
        </div>
        
        <form [formGroup]="form" class="properties-form">
          <!-- Basic Info -->
          <div class="form-section">
             <h4>General</h4>
             <mat-form-field appearance="outline" class="full-width">
               <mat-label>Label</mat-label>
               <input matInput formControlName="label">
             </mat-form-field>

             <mat-form-field appearance="outline" class="full-width">
               <mat-label>Field Name (ID)</mat-label>
               <input matInput formControlName="name">
             </mat-form-field>

             <mat-form-field appearance="outline" class="full-width">
               <mat-label>Default Value</mat-label>
               <input matInput formControlName="defaultValue">
             </mat-form-field>
          </div>

          <mat-divider></mat-divider>

          <!-- UI Config -->
          <div class="form-section" formGroupName="ui">
             <h4>UI Settings</h4>
             <mat-form-field appearance="outline" class="full-width">
               <mat-label>Placeholder</mat-label>
               <input matInput formControlName="placeholder">
             </mat-form-field>

             <mat-form-field appearance="outline" class="full-width">
               <mat-label>Hint Text</mat-label>
               <input matInput formControlName="hint">
             </mat-form-field>

             <div formGroupName="colSpan" class="grid-config">
               <mat-form-field appearance="outline">
                 <mat-label>Col (Desktop)</mat-label>
                 <mat-select formControlName="lg">
                   @for (n of [1,2,3,4,6,8,9,12]; track n) {
                     <mat-option [value]="n">{{n}}</mat-option>
                   }
                 </mat-select>
               </mat-form-field>
               <mat-form-field appearance="outline">
                 <mat-label>Col (Tablet)</mat-label>
                 <mat-select formControlName="md">
                   @for (n of [1,2,3,4,6,8,9,12]; track n) {
                     <mat-option [value]="n">{{n}}</mat-option>
                   }
                 </mat-select>
               </mat-form-field>
             </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Validators -->
          <div class="form-section">
             <h4>Validations</h4>
             <div class="validator-options-grid">
                <mat-checkbox [checked]="hasValidator('required')" (change)="toggleValidator('required')">
                   Required
                </mat-checkbox>
                
                @if (field.type === 'text') {
                  <mat-checkbox [checked]="hasValidator('email')" (change)="toggleValidator('email')">
                    Email Format
                  </mat-checkbox>

                  <mat-checkbox [checked]="hasValidator('numeric')" (change)="toggleValidator('numeric')">
                    Numeric Only
                  </mat-checkbox>

                  <mat-checkbox [checked]="hasValidator('tcNo')" (change)="toggleValidator('tcNo')">
                    T.C. Kimlik No
                  </mat-checkbox>
                }
             </div>

             @if (field.type === 'text') {
               <div class="advanced-validators">
                 <mat-form-field appearance="outline" class="full-width mini">
                   <mat-label>Min Length</mat-label>
                   <input matInput type="number" [value]="getValidatorValue('minLength')" (change)="setValidatorValue('minLength', $any($event.target).value)">
                 </mat-form-field>

                 <mat-form-field appearance="outline" class="full-width mini">
                   <mat-label>Max Length</mat-label>
                   <input matInput type="number" [value]="getValidatorValue('maxLength')" (change)="setValidatorValue('maxLength', $any($event.target).value)">
                 </mat-form-field>
               </div>
             }
          </div>

          <!-- Options for Select -->
          @if (field.type === 'select') {
            <mat-divider></mat-divider>
            <div class="form-section">
               <h4>Options</h4>
               @for (opt of field.options; track $index) {
                 <div class="option-row">
                   <input type="text" [value]="opt.label" (change)="updateOption($index, 'label', $any($event.target).value)" placeholder="Label">
                   <input type="text" [value]="opt.value" (change)="updateOption($index, 'value', $any($event.target).value)" placeholder="Value">
                   <button mat-icon-button color="warn" (click)="removeOption($index)">
                     <mat-icon>delete</mat-icon>
                   </button>
                 </div>
               }
               <button mat-button color="primary" (click)="addOption()">
                 <mat-icon>add</mat-icon> Add Option
               </button>
            </div>
          }
        </form>
      } @else {
        <div class="no-selection">
          <mat-icon>touch_app</mat-icon>
          <p>Select a field to edit its properties</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .properties-container {
      padding: 20px;
      height: 100%;
      max-width: 100%;
      background: #ffffff;
      border-left: 1px solid #e0e0e0;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .panel-header {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      color: #3f51b5;
    }
    .panel-header h3 {
      margin: 0 0 0 12px;
      font-size: 18px;
    }
    .form-section {
      padding: 16px 0;
    }
    .form-section h4 {
      margin: 0 0 16px 0;
      font-size: 14px;
      color: #546e7a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .full-width {
      width: 100%;
    }
    .grid-config {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .validator-options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .advanced-validators {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }
    .full-width.mini {
      flex: 1;
    }
  `]
})
export class FieldPropertiesPanelComponent implements OnInit {
  state = inject(BuilderStateService);
  fb = inject(FormBuilder);
  form: FormGroup;

  constructor() {
    this.form = this.createForm();

    // Watch for selection changes
    effect(() => {
      const field = this.state.selectedField();
      if (field) {
        this.form.patchValue(field, { emitEvent: false });
      }
    });

    // Watch for form changes
    this.form.valueChanges.subscribe((val: any) => {
      const fieldId = this.state.selectedFieldId();
      if (fieldId) {
        this.state.updateField(fieldId, val);
      }
    });
  }

  ngOnInit() { }

  createForm() {
    return this.fb.group({
      label: ['', Validators.required],
      name: ['', Validators.required],
      defaultValue: [''],
      ui: this.fb.group({
        placeholder: [''],
        hint: [''],
        colSpan: this.fb.group({
          xs: [12],
          md: [12],
          lg: [12]
        })
      }),
      validators: [[]],
      options: [[]]
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'text': return 'text_fields';
      case 'select': return 'arrow_drop_down_circle';
      default: return 'edit';
    }
  }

  hasValidator(type: string): boolean {
    const field = this.state.selectedField();
    return !!field?.validators.find(v => v.type === type);
  }

  toggleValidator(type: string) {
    const field = this.state.selectedField();
    if (!field) return;

    let validators = [...field.validators];
    if (this.hasValidator(type)) {
      validators = validators.filter(v => v.type !== type);
    } else {
      validators.push({ type });
    }
    this.state.updateField(field.id, { validators });
  }

  getValidatorValue(type: string): any {
    const field = this.state.selectedField();
    const v = field?.validators.find(v => v.type === type);
    return v ? v.value : '';
  }

  setValidatorValue(type: string, value: any) {
    const field = this.state.selectedField();
    if (!field) return;

    let validators = [...field.validators];
    const index = validators.findIndex(v => v.type === type);

    if (value === '' || value === null) {
      if (index !== -1) validators.splice(index, 1);
    } else {
      if (index !== -1) {
        validators[index] = { ...validators[index], value };
      } else {
        validators.push({ type, value });
      }
    }
    this.state.updateField(field.id, { validators });
  }

  addOption() {
    const field = this.state.selectedField();
    if (!field) return;
    const options = [...(field.options || [])];
    options.push({ label: `New Option ${options.length + 1}`, value: `${options.length + 1}` });
    this.state.updateField(field.id, { options });
  }

  removeOption(index: number) {
    const field = this.state.selectedField();
    if (!field) return;
    const options = [...(field.options || [])];
    options.splice(index, 1);
    this.state.updateField(field.id, { options });
  }

  updateOption(index: number, prop: 'label' | 'value', val: string) {
    const field = this.state.selectedField();
    if (!field) return;
    const options = [...(field.options || [])];
    options[index] = { ...options[index], [prop]: val };
    this.state.updateField(field.id, { options });
  }
}
