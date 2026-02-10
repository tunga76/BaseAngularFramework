import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@platform/ui-platform';

@Component({
    selector: 'app-input-showcase',
    standalone: true,
    imports: [CommonModule, FormsModule, InputComponent],
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
          <platform-input
            label="Name"
            placeholder="Enter your name"
            [(ngModel)]="name">
          </platform-input>

          <platform-input
            label="Email"
            type="email"
            placeholder="you@example.com"
            [(ngModel)]="email">
          </platform-input>

          <platform-input
            label="Password"
            type="password"
            placeholder="••••••••"
            [(ngModel)]="password">
          </platform-input>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">With Icons</h2>
        <div class="demo-container">
          <platform-input
            label="Search"
            prefixIcon="🔍"
            placeholder="Search products..."
            [(ngModel)]="search">
          </platform-input>

          <platform-input
            label="Username"
            prefixText="@"
            placeholder="username"
            [(ngModel)]="username">
          </platform-input>

          <platform-input
            label="Website"
            suffixText=".com"
            placeholder="mysite"
            [(ngModel)]="website">
          </platform-input>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Validation States</h2>
        <div class="demo-container">
          <platform-input
            label="Email (with error)"
            type="email"
            [invalid]="true"
            errorMessage="Please enter a valid email address"
            [(ngModel)]="email2">
          </platform-input>

          <platform-input
            label="Required Field"
            [required]="true"
            helperText="This field is required"
            [(ngModel)]="requiredField">
          </platform-input>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">States</h2>
        <div class="demo-container">
          <platform-input
            label="Disabled Input"
            [disabled]="true"
            [(ngModel)]="disabledValue">
          </platform-input>

          <platform-input
            label="Readonly Input"
            [readonly]="true"
            [(ngModel)]="readonlyValue">
          </platform-input>
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
