import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformHttpService } from '../http/services/platform-http.service';
import { ThemeService } from '../theme/services/theme.service';
import { PopupService } from '../popup/services/popup.service';

@Component({
    selector: 'app-example-feature',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="example-container">
      <header class="example-header">
        <h1>Integrated Platform Demo</h1>
        <button class="btn btn-theme" (click)="toggleTheme()">
          Switch to {{ (theme$ | async) === 'light' ? 'Dark' : 'Light' }} Mode
        </button>
      </header>

      <section class="example-content">
        <div class="card">
          <h3>HTTP & Loading Integration</h3>
          <p>This request automatically triggers the global loader and handles errors with a popup.</p>
          <div class="button-group">
            <button class="btn btn-success" (click)="makeSuccessfulRequest()">
              Make Successful Request
            </button>
            <button class="btn btn-error" (click)="makeFailedRequest()">
              Make Failed Request (Trigger Popup)
            </button>
          </div>
        </div>

        <div class="card">
          <h3>Popup System</h3>
          <p>Experiment with alert and confirm dialogs.</p>
          <div class="button-group">
            <button class="btn btn-primary" (click)="showAlert()">Show Alert</button>
            <button class="btn btn-secondary" (click)="showConfirm()">Show Confirm</button>
          </div>
          <p *ngIf="confirmResult !== null" class="result">
            Last Confirm Result: <strong>{{ confirmResult }}</strong>
          </p>
        </div>
      </section>
    </div>
  `,
    styles: [`
    .example-container {
      padding: var(--space-xl);
      background: var(--surface-bg);
      min-height: 100vh;
      color: var(--text-main);
      font-family: var(--font-family-base);
    }
    .example-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
    }
    .example-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-xl);
    }
    .card {
      background: var(--surface-paper);
      padding: var(--space-xl);
      border-radius: var(--radius-lg);
      border: 1px solid var(--surface-border);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
      margin-top: var(--space-lg);
    }
    .btn {
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      font-weight: 600;
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.9; }
    .btn-primary { background: var(--color-primary); color: var(--color-primary-contrast); }
    .btn-secondary { background: var(--color-secondary); color: var(--color-secondary-contrast); }
    .btn-success { background: var(--color-success); color: white; }
    .btn-error { background: var(--color-error); color: white; }
    .btn-theme { background: var(--text-main); color: var(--surface-bg); }
    .result { margin-top: var(--space-md); color: var(--color-primary); }
  `]
})
export class ExampleFeatureComponent {
    theme$ = this.themeService.theme$;
    confirmResult: boolean | null = null;

    constructor(
        private http: PlatformHttpService,
        private themeService: ThemeService,
        private popupService: PopupService
    ) { }

    toggleTheme(): void {
        this.themeService.toggleTheme();
    }

    makeSuccessfulRequest(): void {
        // This will trigger the loader automatically via interceptor
        this.http.get('https://jsonplaceholder.typicode.com/posts/1').subscribe(res => {
            console.log('Success:', res);
            this.popupService.alert('Request completed successfully!', 'Success');
        });
    }

    makeFailedRequest(): void {
        // This will trigger loader AND error popup via interceptors
        this.http.get('https://jsonplaceholder.typicode.com/invalid-url').subscribe({
            error: (err) => {
                console.log('Error handled by interceptor, but we still get it here if needed:', err);
            }
        });
    }

    showAlert(): void {
        this.popupService.alert('This is a core platform alert!', 'Important');
    }

    showConfirm(): void {
        this.popupService.confirm('Do you like this integrated platform?', 'Question')
            .subscribe(result => {
                this.confirmResult = result;
            });
    }
}
