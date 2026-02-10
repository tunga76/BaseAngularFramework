import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent, ButtonComponent } from '@platform/ui-platform';

@Component({
    selector: 'app-spinner-showcase',
    standalone: true,
    imports: [CommonModule, SpinnerComponent, ButtonComponent],
    template: `
    <div class="showcase-page">
      <div class="page-header">
        <h1 class="page-title">Spinner Component</h1>
        <p class="page-description">Loading indicators with multiple variants</p>
      </div>

      <div class="section">
        <h2 class="section-title">Spinner Variants</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-spinner variant="spinner"></platform-spinner>
            <platform-spinner variant="dots"></platform-spinner>
            <platform-spinner variant="pulse"></platform-spinner>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Sizes</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-spinner size="sm"></platform-spinner>
            <platform-spinner size="md"></platform-spinner>
            <platform-spinner size="lg"></platform-spinner>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">With Labels</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-spinner label="Loading..."></platform-spinner>
            <platform-spinner variant="dots" label="Processing"></platform-spinner>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Overlay Mode</h2>
        <div class="demo-container">
          <platform-button (onClick)="showOverlay()">Show Overlay Spinner</platform-button>
        </div>
      </div>

      <platform-spinner
        *ngIf="overlayVisible"
        [overlay]="true"
        label="Please wait...">
      </platform-spinner>
    </div>
  `
})
export class SpinnerShowcaseComponent {
    overlayVisible = false;

    showOverlay() {
        this.overlayVisible = true;
        setTimeout(() => this.overlayVisible = false, 3000);
    }
}
