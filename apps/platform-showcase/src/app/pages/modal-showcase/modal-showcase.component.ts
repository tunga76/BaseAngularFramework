import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent, ButtonComponent } from '@platform/ui-platform';

@Component({
  selector: 'app-modal-showcase',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  template: `
    <div class="showcase-page">
      <div class="page-header">
        <h1 class="page-title">Modal Component</h1>
        <p class="page-description">Dialog windows with backdrop and keyboard support</p>
      </div>

      <div class="section">
        <h2 class="section-title">Basic Modal</h2>
        <div class="demo-container">
          <platform-button (onClick)="openModal('basic')">Open Basic Modal</platform-button>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Modal Sizes</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-button (onClick)="openModal('sm')">Small</platform-button>
            <platform-button (onClick)="openModal('md')">Medium</platform-button>
            <platform-button (onClick)="openModal('lg')">Large</platform-button>
            <platform-button (onClick)="openModal('xl')">Extra Large</platform-button>
          </div>
        </div>
      <div class="section">
        <h2 class="section-title">Modal Variants</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-button (onClick)="openModal('md', 'info')">Info</platform-button>
            <platform-button (onClick)="openModal('md', 'success')">Success</platform-button>
            <platform-button (onClick)="openModal('md', 'warning')">Warning</platform-button>
            <platform-button (onClick)="openModal('md', 'error')">Error</platform-button>
          </div>
        </div>
      </div>

      <platform-modal
        [open]="modalOpen"
        [size]="modalSize"
        [title]="modalTitle"
        [variant]="modalVariant"
        (onClose)="closeModal()">
        <div modal-content>
          <p>This is a {{ modalVariant }} modal. Press Escape or click outside to close.</p>
        </div>
        <div modal-footer>
          <platform-button variant="primary" (onClick)="closeModal()">Confirm</platform-button>
          <platform-button variant="secondary" (onClick)="closeModal()">Cancel</platform-button>
        </div>
      </platform-modal>
    </div>
  `
})
export class ModalShowcaseComponent {
  modalOpen = false;
  modalSize: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  modalVariant: 'default' | 'info' | 'success' | 'warning' | 'error' = 'default';
  modalTitle = 'Modal Title';

  openModal(size: string, variant: 'default' | 'info' | 'success' | 'warning' | 'error' = 'default') {
    this.modalSize = size as any;
    this.modalVariant = variant;
    this.modalTitle = `${variant.charAt(0).toUpperCase() + variant.slice(1)} Modal`;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }
}
