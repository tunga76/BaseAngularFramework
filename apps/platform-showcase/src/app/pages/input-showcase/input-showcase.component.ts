import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent, FormFieldComponent } from '@platform/ui-platform';

@Component({
  selector: 'app-input-showcase',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, FormFieldComponent],
  template: `
    <div class="showcase-page">
      <div class="page-header">
        <h1 class="page-title">Input Component</h1>
        <p class="page-description">
          Form input component with validation, labels, error messages, and prefix/suffix support.
        </p>
      </div>

      <div class="section">
        <h2 class="section-title">Basic Inputs</h2>
        <div class="demo-container">
          <platform-form-field label="Name">
            <platform-input
              placeholder="Enter your name"
              [(ngModel)]="name">
            </platform-input>
          </platform-form-field>

          <platform-form-field label="Email">
            <platform-input
              type="email"
              placeholder="you@example.com"
              [(ngModel)]="email">
            </platform-input>
          </platform-form-field>

          <platform-form-field label="Password">
            <platform-input
              type="password"
              placeholder="••••••••"
              [(ngModel)]="password">
            </platform-input>
          </platform-form-field>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">With Icons</h2>
        <div class="demo-container">
          <platform-form-field label="Search">
            <platform-input
              prefixIcon="🔍"
              placeholder="Search products..."
              [(ngModel)]="search">
            </platform-input>
          </platform-form-field>

          <platform-form-field label="Username">
            <platform-input
              prefixText="@"
              placeholder="username"
              [(ngModel)]="username">
            </platform-input>
          </platform-form-field>

          <platform-form-field label="Website">
            <platform-input
              suffixText=".com"
              placeholder="mysite"
              [(ngModel)]="website">
            </platform-input>
          </platform-form-field>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Validation States</h2>
        <div class="demo-container">
          <platform-form-field label="Email (with error)" errorMessage="Please enter a valid email address">
            <platform-input
              type="email"
              [errorState]="true"
              [(ngModel)]="email2">
            </platform-input>
          </platform-form-field>

          <platform-form-field label="Required Field" [required]="true" hint="This field is required">
            <platform-input
              [(ngModel)]="requiredField">
            </platform-input>
          </platform-form-field>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">States</h2>
        <div class="demo-container">
          <platform-form-field label="Disabled Input">
            <platform-input
              [disabled]="true"
              [(ngModel)]="disabledValue">
            </platform-input>
          </platform-form-field>

          <platform-form-field label="Readonly Input">
            <platform-input
              [readonly]="true"
              [(ngModel)]="readonlyValue">
            </platform-input>
          </platform-form-field>
        </div>
      </div>
    </div>
  `
})
export class InputShowcaseComponent {
  name = '';
  email = '';
  password = '';
  search = '';
  username = '';
  website = '';
  email2 = 'invalid-email';
  requiredField = '';
  disabledValue = 'Cannot edit';
  readonlyValue = 'Read only value';
}
