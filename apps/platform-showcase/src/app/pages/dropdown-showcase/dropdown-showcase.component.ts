import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent, ButtonComponent } from '@platform/ui-platform';

@Component({
    selector: 'app-dropdown-showcase',
    standalone: true,
    imports: [CommonModule, DropdownComponent, ButtonComponent],
    template: `
    <div class="showcase-page">
      <div class="page-header">
        <h1 class="page-title">Dropdown Component</h1>
        <p class="page-description">Menu component with keyboard navigation</p>
      </div>

      <div class="section">
        <h2 class="section-title">Basic Dropdown</h2>
        <div class="demo-container">
          <platform-dropdown>
            <platform-button dropdown-trigger>Open Menu ▾</platform-button>
            <div dropdown-content>
              <button class="dropdown-item" (click)="handleAction('Profile')">👤 Profile</button>
              <button class="dropdown-item" (click)="handleAction('Settings')">⚙️ Settings</button>
              <hr class="dropdown-divider">
              <button class="dropdown-item" (click)="handleAction('Logout')">🚪 Logout</button>
            </div>
          </platform-dropdown>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Dropdown Positions</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-dropdown position="bottom">
              <platform-button dropdown-trigger size="sm">Bottom ▾</platform-button>
              <div dropdown-content>
                <button class="dropdown-item">Option 1</button>
                <button class="dropdown-item">Option 2</button>
              </div>
            </platform-dropdown>

            <platform-dropdown position="top">
              <platform-button dropdown-trigger size="sm">Top ▴</platform-button>
              <div dropdown-content>
                <button class="dropdown-item">Option 1</button>
                <button class="dropdown-item">Option 2</button>
              </div>
            </platform-dropdown>
          </div>
        </div>
      </div>

      <div *ngIf="selectedAction" style="margin-top: 20px; padding: 16px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
        <strong>Action Selected:</strong> {{ selectedAction }}
      </div>
    </div>
  `
})
export class DropdownShowcaseComponent {
    selectedAction = '';

    handleAction(action: string) {
        this.selectedAction = action;
        setTimeout(() => this.selectedAction = '', 3000);
    }
}
