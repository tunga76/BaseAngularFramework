import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {
    AuthStore,
    LoadingStore,
    FeatureStore,
    ThemeStore,
    HasPermissionDirective,
    HasRoleDirective,
    LoadingDirective,
    DisableOnLoadingDirective,
    DebounceClickDirective,
    ConfirmDirective,
    TrimDirective,
    NumericOnlyDirective,
    UppercaseDirective,
    FormErrorDirective,
    FeatureEnabledDirective,
    TrackEventDirective,
    ThemeClassDirective
} from '@platform/directives';

@Component({
    selector: 'app-directives-test',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HasPermissionDirective,
        HasRoleDirective,
        LoadingDirective,
        DisableOnLoadingDirective,
        DebounceClickDirective,
        ConfirmDirective,
        TrimDirective,
        NumericOnlyDirective,
        UppercaseDirective,
        FormErrorDirective,
        FeatureEnabledDirective,
        TrackEventDirective,
        ThemeClassDirective
    ],
    template: `
    <div class="directives-demo-container" [appThemeClass]="'demo-page'">
      <h1>Directive Framework Test Suite</h1>
      <p>Test the platform core directives here.</p>

      <!-- 1. AUTH DIRECTIVES -->
      <section class="demo-section">
        <h2>1. Authentication</h2>
        <div class="controls">
          <button (click)="togglePermission('USER_CREATE')">Toggle USER_CREATE Perm</button>
          <button (click)="toggleRole('Admin')">Toggle Admin Role</button>
        </div>
        <div class="test-area">
          <div *appHasPermission="'USER_CREATE'" class="test-box success">
            ✅ You have 'USER_CREATE' permission.
          </div>
          <div *appHasRole="'Admin'" class="test-box warning">
            👑 You have 'Admin' role.
          </div>
        </div>
      </section>

      <!-- 2. LOADING DIRECTIVES -->
      <section class="demo-section">
        <h2>2. Loading & Async</h2>
        <div class="controls">
          <button (click)="toggleLoading()">Toggle Overlay Loading</button>
          <button (click)="simulateAsyncAction()">Run 'saveUser' (3s)</button>
        </div>
        <div class="test-area">
          <div [appLoading]="isManualLoading()" class="loading-target">
            This area is affected by [appLoading].
          </div>
          <button appDisableOnLoading="saveUser" class="action-btn">
            Disabled when 'saveUser' is active
          </button>
        </div>
      </section>

      <!-- 3. INTERACTION DIRECTIVES -->
      <section class="demo-section">
        <h2>3. Interaction</h2>
        <div class="test-area">
          <button 
            appDebounceClick 
            [debounceTime]="1000" 
            (debouncedClick)="onDebouncedClick()"
            class="action-btn">
            Debounce 1s (Clicked: {{ clickCount() }})
          </button>
          
          <button 
            appConfirm="Aksiyona devam etmek istiyor musunuz?" 
            (confirmed)="onConfirmed()"
            class="action-btn danger">
            Confirm Before Action
          </button>
        </div>
      </section>

      <!-- 4. FORM DIRECTIVES -->
      <section class="demo-section">
        <h2>4. Forms</h2>
        <form [formGroup]="testForm" class="test-form">
          <div class="form-group">
            <label>Trim on Blur:</label>
            <input type="text" appTrim formControlName="trimmedInput" placeholder="  lots of spaces  ">
          </div>
          
          <div class="form-group">
            <label>Numeric Only:</label>
            <input type="text" appNumericOnly formControlName="numericInput" placeholder="Numbers only">
          </div>
          
          <div class="form-group">
            <label>Uppercase on Input:</label>
            <input type="text" appUppercase formControlName="upperInput" placeholder="abc -> ABC">
          </div>
          
          <div class="form-group">
            <label>Validation Errors:</label>
            <input type="email" formControlName="emailInput" placeholder="Enter email">
            <div class="error-msg" appFormError="emailInput"></div>
          </div>
        </form>
      </section>

      <!-- 5. FEATURE FLAG & ANALYTICS -->
      <section class="demo-section">
        <h2>5. Features & Analytics</h2>
        <div class="controls">
          <button (click)="toggleFeature('new-dashboard')">Toggle 'new-dashboard'</button>
        </div>
        <div class="test-area">
          <div *appFeatureEnabled="'new-dashboard'" class="test-box feature">
            ✨ New Dashboard Feature Enabled
          </div>
          
          <button appTrackEvent="test_button_clicked" [eventProps]="{ timestamp: now }" class="action-btn">
            Click to Log Analytics
          </button>
        </div>
      </section>

      <!-- 6. THEME -->
      <section class="demo-section">
        <h2>6. Theme Support</h2>
        <div class="controls">
          <button (click)="toggleTheme()">Toggle Dark/Light Mode</button>
        </div>
        <div class="test-area">
          <div appThemeClass="themed-card" class="card">
            I react to ThemeStore change.
          </div>
        </div>
      </section>
    </div>
  `,
    styles: [`
    .directives-demo-container { padding: 2rem; max-width: 800px; margin: 0 auto; color: var(--text-color, #333); }
    .demo-section { margin-bottom: 2rem; padding: 1.5rem; border: 1px solid #ddd; border-radius: 8px; background: #fff; }
    .controls { margin-bottom: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .test-area { display: flex; gap: 1rem; flex-direction: column; }
    .test-box { padding: 1rem; border-radius: 4px; border: 1px solid transparent; }
    .success { background: #e6f7ef; border-color: #52c41a; color: #155724; }
    .warning { background: #fffbe6; border-color: #ffe58f; color: #856404; }
    .feature { background: #f0f5ff; border-color: #2f54eb; color: #1d39c4; color: #10239e; }
    .loading-target { height: 100px; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc; }
    .action-btn { padding: 0.5rem 1rem; cursor: pointer; border: 1px solid #d9d9d9; border-radius: 4px; background: #fff; }
    .action-btn:hover { border-color: #40a9ff; color: #40a9ff; }
    .action-btn.danger { color: #f5222d; border-color: #f5222d; }
    .action-btn.danger:hover { background: #f5222d; color: #fff; }
    .test-form { display: grid; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.25rem; }
    .form-group input { padding: 0.5rem; border: 1px solid #d9d9d9; border-radius: 4px; }
    .error-msg { color: #f5222d; font-size: 0.85rem; height: 1.5rem; }
    .card { padding: 2rem; border-radius: 8px; text-align: center; }
    
    /* Demo Theme Classes */
    .themed-card-light { background: #f9f9f9; color: #333; }
    .themed-card-dark { background: #333; color: #fff; }
    .demo-page-dark { background: #1a1a1a; color: #eee; }
  `]
})
export class DirectivesTestComponent {
    private authStore = inject(AuthStore);
    private loadingStore = inject(LoadingStore);
    private featureStore = inject(FeatureStore);
    private themeStore = inject(ThemeStore);

    isManualLoading = signal(false);
    clickCount = signal(0);
    now = Date.now();

    testForm = new FormGroup({
        trimmedInput: new FormControl(''),
        numericInput: new FormControl(''),
        upperInput: new FormControl(''),
        emailInput: new FormControl('', [Validators.required, Validators.email])
    });

    togglePermission(perm: string) {
        const perms = this.authStore.permissions();
        if (perms.includes(perm)) {
            this.authStore.updateState({ permissions: perms.filter(p => p !== perm) });
        } else {
            this.authStore.updateState({ permissions: [...perms, perm] });
        }
    }

    toggleRole(role: string) {
        const roles = this.authStore.roles();
        if (roles.includes(role)) {
            this.authStore.updateState({ roles: roles.filter(r => r !== role) });
        } else {
            this.authStore.updateState({ roles: [...roles, role] });
        }
    }

    toggleLoading() {
        this.isManualLoading.update(v => !v);
    }

    simulateAsyncAction() {
        this.loadingStore.startLoading('saveUser');
        setTimeout(() => {
            this.loadingStore.stopLoading('saveUser');
        }, 3000);
    }

    onDebouncedClick() {
        this.clickCount.update(c => c + 1);
    }

    onConfirmed() {
        alert('Action Confirmed!');
    }

    toggleFeature(key: string) {
        this.featureStore.updateFlag(key, !this.featureStore.isEnabled(key));
    }

    toggleTheme() {
        this.themeStore.toggleMode();
    }
}
