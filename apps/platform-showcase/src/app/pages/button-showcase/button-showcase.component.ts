import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@platform/ui-platform';

@Component({
    selector: 'app-button-showcase',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    template: `
    <div class="showcase-page">
      <div class="page-header">
        <h1 class="page-title">Button Component</h1>
        <p class="page-description">
          Customizable button component with multiple variants, sizes, loading states, and full accessibility support.
        </p>
      </div>

      <div class="section">
        <h2 class="section-title">Variants</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-button variant="primary">Primary</platform-button>
            <platform-button variant="secondary">Secondary</platform-button>
            <platform-button variant="ghost">Ghost</platform-button>
            <platform-button variant="danger">Danger</platform-button>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-button size="sm">Small</platform-button>
            <platform-button size="md">Medium</platform-button>
            <platform-button size="lg">Large</platform-button>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Loading States</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-button [loading]="isLoading" (onClick)="toggleLoading()">
              {{ isLoading ? 'Loading...' : 'Click to Load' }}
            </platform-button>
            <platform-button variant="secondary" [loading]="true">
              Processing
            </platform-button>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Disabled States</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-button [disabled]="true">Disabled Primary</platform-button>
            <platform-button variant="secondary" [disabled]="true">Disabled Secondary</platform-button>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Full Width</h2>
        <div class="demo-container">
          <platform-button [fullWidth]="true">Full Width Button</platform-button>
        </div>
      </div>
    </div>
  `
})
export class ButtonShowcaseComponent {
    isLoading = false;

    toggleLoading() {
        this.isLoading = true;
        setTimeout(() => this.isLoading = false, 2000);
    }
}
