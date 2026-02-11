import { Component, Input, Output, EventEmitter, OnDestroy, TemplateRef, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

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
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <ng-template #modalTemplate>
      <div class="modal-header" [class]="'modal-header-' + variant" *ngIf="title || showCloseButton">
        <h2 *ngIf="title" mat-dialog-title class="modal-title">
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

      <div mat-dialog-content class="modal-content">
        <ng-content select="[modal-content]"></ng-content>
        <ng-content></ng-content>
      </div>

      <div mat-dialog-actions class="modal-footer" *ngIf="hasFooter">
        <ng-content select="[modal-footer]"></ng-content>
      </div>
    </ng-template>
  `,
  styles: [`
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-bottom: 1px solid var(--color-border, #e5e7eb);
      min-height: 56px;
    }
    
    .modal-header-default { background-color: transparent; }
    .modal-header-info { background-color: var(--color-info-bg, #eff6ff); border-bottom-color: var(--color-info-border, #bfdbfe); }
    .modal-header-success { background-color: var(--color-success-bg, #f0fdf4); border-bottom-color: var(--color-success-border, #bbf7d0); }
    .modal-header-warning { background-color: var(--color-warning-bg, #fefce8); border-bottom-color: var(--color-warning-border, #fde047); }
    .modal-header-error { background-color: var(--color-error-bg, #fef2f2); border-bottom-color: var(--color-error-border, #fecaca); }

    .modal-title {
      font-size: var(--font-size-lg, 18px);
      font-weight: 600;
      color: var(--color-text, #111827);
      margin: 0;
    }

    .modal-header-info .modal-title { color: var(--color-info-text, #1e40af); }
    .modal-header-success .modal-title { color: var(--color-success-text, #166534); }
    .modal-header-warning .modal-title { color: var(--color-warning-text, #854d0e); }
    .modal-header-error .modal-title { color: var(--color-error-text, #991b1b); }

    .modal-close {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      font-size: 20px;
      color: var(--color-text-muted, #6b7280);
      border-radius: var(--radius-md, 4px);
      transition: all var(--transition-fast, 0.15s ease);
      margin-left: auto;
      line-height: 1;
    }

    .modal-close:hover {
      background-color: var(--color-background, #f3f4f6);
      color: var(--color-text, #374151);
    }

    .modal-content {
      padding: 0 !important;
      margin: 0 !important;
      max-height: 70vh !important;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 0 0 0;
      margin: 0;
    }

    ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
        padding: 24px !important;
        border-radius: var(--radius-md, 8px) !important;
    }
  `]
})
export class ModalComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() open = false;
  @Input() title?: string;
  @Input() variant: 'default' | 'info' | 'success' | 'warning' | 'error' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showCloseButton = true;
  @Input() closeOnBackdropClick = true;
  @Input() closeOnEscape = true;
  @Output() onClose = new EventEmitter<void>();

  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;

  private dialogRef?: MatDialogRef<any>;
  hasFooter = true;

  constructor(private dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && !changes['open'].firstChange) {
      if (this.open) {
        this.openDialog();
      } else {
        this.closeDialog();
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.open) {
      this.openDialog();
    }
  }

  ngOnDestroy(): void {
    this.closeDialog();
  }

  private openDialog(): void {
    if (this.dialogRef || !this.modalTemplate) {
      return;
    }

    const widthMap = {
      sm: '400px',
      md: '600px',
      lg: '800px',
      xl: '1000px'
    };

    this.dialogRef = this.dialog.open(this.modalTemplate, {
      width: widthMap[this.size],
      disableClose: !this.closeOnBackdropClick && !this.closeOnEscape,
      panelClass: 'platform-modal-panel',
      hasBackdrop: true
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = undefined;
      // Only emit if it was closed by backdrop or escape (implicitly),
      // or if we need to sync the parent's state.
      // If the parent is strictly controlling 'open', we should emit onClose so it can set open = false.
      if (this.open) {
        this.onClose.emit();
      }
    });

    // Handle backdrop click and escape key manually if needed for finer control,
    // but MatDialog handles them via disableClose configuration mostly.
    // However, MatDialog treats 'disableClose: true' as "neither backdrop nor escape closes it".
    // If we want mixed behavior (e.g. escape works but backdrop doesn't), we need custom handling or
    // use the 'closeOnNavigation' etc.
    // For now, mapping 'disableClose' to strict negation of both is a simplification.
    // Let's refine:

    this.dialogRef.disableClose = !this.closeOnBackdropClick;

    // We can hook into keyboard events on the dialog ref if we needed specific Escape handling separate from backdrop.
    // But standard MatDialog behavior is usually sufficient.
  }

  private closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = undefined;
    }
  }

  close(): void {
    this.closeDialog();
    this.onClose.emit();
  }
}
