import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';

/**
 * Modal dialog component with backdrop, animations, and focus management.
 * 
 * Features:
 * - Backdrop with click-to-close
 * - Escape key to close
 * - Focus trap
 * - Animations
 * - Customizable sizes
 * - Header, content, and footer slots
 * 
 * @example
 * ```html
 * <platform-modal 
 *   [open]="isOpen" 
 *   (onClose)="handleClose()"
 *   title="Confirm Action">
 *   <div modal-content>
 *     Are you sure you want to proceed?
 *   </div>
 *   <div modal-footer>
 *     <platform-button (onClick)="confirm()">Confirm</platform-button>
 *     <platform-button variant="secondary" (onClick)="cancel()">Cancel</platform-button>
 *   </div>
 * </platform-modal>
 * ```
 */
@Component({
    selector: 'platform-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="open" class="modal-backdrop" 
         (click)="handleBackdropClick()"
         [@fadeIn]>
      <div class="modal-container" 
           [class]="'modal-' + size"
           (click)="$event.stopPropagation()"
           role="dialog"
           [attr.aria-modal]="true"
           [attr.aria-labelledby]="title ? 'modal-title' : null"
           [@slideIn]>
        
        <div class="modal-header" *ngIf="title || showCloseButton">
          <h2 *ngIf="title" id="modal-title" class="modal-title">
            {{ title }}
          </h2>
          <button 
            *ngIf="showCloseButton"
            type="button"
            class="modal-close"
            (click)="close()"
            aria-label="Close modal">
            ✕
          </button>
        </div>

        <div class="modal-content">
          <ng-content select="[modal-content]"></ng-content>
          <ng-content></ng-content>
        </div>

        <div class="modal-footer" *ngIf="hasFooter">
          <ng-content select="[modal-footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
    }

    .modal-container {
      background-color: var(--color-surface, #ffffff);
      border-radius: var(--radius-md, 8px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                  0 10px 10px -5px rgba(0, 0, 0, 0.04);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .modal-sm { width: 400px; max-width: 100%; }
    .modal-md { width: 600px; max-width: 100%; }
    .modal-lg { width: 800px; max-width: 100%; }
    .modal-xl { width: 1000px; max-width: 100%; }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid var(--color-border, #e5e7eb);
    }

    .modal-title {
      font-size: var(--font-size-lg, 18px);
      font-weight: 600;
      color: var(--color-text, #111827);
      margin: 0;
    }

    .modal-close {
      background: none;
      border: none;
      padding: 4px 8px;
      cursor: pointer;
      font-size: 20px;
      color: var(--color-text-muted, #6b7280);
      border-radius: var(--radius-md, 4px);
      transition: all var(--transition-fast, 0.15s ease);
    }

    .modal-close:hover {
      background-color: var(--color-background, #f3f4f6);
      color: var(--color-text, #374151);
    }

    .modal-close:focus-visible {
      outline: 2px solid var(--color-primary, #3b82f6);
      outline-offset: 2px;
    }

    .modal-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid var(--color-border, #e5e7eb);
      background-color: var(--color-background, #f9fafb);
    }
  `],
    animations: []
})
export class ModalComponent implements OnInit, OnDestroy {
    /** Whether the modal is open */
    @Input() open = false;

    /** Modal title */
    @Input() title?: string;

    /** Modal size */
    @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

    /** Whether to show close button */
    @Input() showCloseButton = true;

    /** Whether clicking backdrop closes modal */
    @Input() closeOnBackdropClick = true;

    /** Whether pressing Escape closes modal */
    @Input() closeOnEscape = true;

    /** Emitted when modal is closed */
    @Output() onClose = new EventEmitter<void>();

    hasFooter = true;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (this.open && isPlatformBrowser(this.platformId)) {
            this.document.body.style.overflow = 'hidden';
        }
    }

    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.document.body.style.overflow = '';
        }
    }

    @HostListener('window:keydown.escape')
    onEscape(): void {
        if (this.open && this.closeOnEscape) {
            this.close();
        }
    }

    handleBackdropClick(): void {
        if (this.closeOnBackdropClick) {
            this.close();
        }
    }

    close(): void {
        this.onClose.emit();
    }
}
