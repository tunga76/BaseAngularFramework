import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, ChangeDetectionStrategy, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseUiComponent } from '../../core/base-component';

@Component({
  selector: 'platform-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <dialog #dialog class="modal-dialog" 
            [class.size-sm]="size === 'sm'"
            [class.size-md]="size === 'md'"
            [class.size-lg]="size === 'lg'"
            [class.size-xl]="size === 'xl'"
            (close)="onNativeClose()"
            (click)="onBackdropClick($event)">
      
      <div class="modal-content-wrapper" (click)="$event.stopPropagation()">
        <!-- Header -->
        <header class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button type="button" class="close-btn" (click)="close()" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <!-- Body -->
        <div class="modal-body">
          <ng-content></ng-content>
        </div>

        <!-- Footer (Optional) -->
        <footer class="modal-footer">
          <ng-content select="[modal-footer]"></ng-content>
        </footer>
      </div>
    </dialog>
  `,
  styles: [`
    .modal-dialog {
      padding: 0;
      border: none;
      border-radius: var(--radius-lg);
      background: var(--color-surface-0);
      box-shadow: var(--shadow-xl);
      color: var(--color-text-primary);
      max-width: 90vw;
      width: 100%;
      margin: auto;
    }

    .modal-dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
    }

    .modal-dialog[open] {
      animation: zoomIn 0.2s ease-out forwards;
    }

    @keyframes zoomIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    /* Sizes */
    .size-sm { width: 400px; }
    .size-md { width: 600px; }
    .size-lg { width: 800px; }
    .size-xl { width: 1000px; }

    .modal-content-wrapper {
      display: flex;
      flex-direction: column;
      max-height: 85vh;
    }

    .modal-header {
      padding: var(--spacing-4) var(--spacing-6);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-title {
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      margin: 0;
    }

    .close-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: var(--spacing-2);
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close-btn:hover {
      background-color: var(--color-surface-100);
      color: var(--color-text-primary);
    }

    .modal-body {
      padding: var(--spacing-6);
      overflow-y: auto;
    }

    .modal-footer {
      padding: var(--spacing-4) var(--spacing-6);
      border-top: 1px solid var(--color-border);
      background-color: var(--color-surface-50);
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-3);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent extends BaseUiComponent implements OnChanges, OnDestroy {
  @Input() title = '';
  @Input() open = false;

  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('dialog') dialogRef!: ElementRef<HTMLDialogElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.dialogRef) {
      const dialog = this.dialogRef.nativeElement;
      if (this.open) {
        if (!dialog.open) dialog.showModal();
      } else {
        if (dialog.open) dialog.close();
      }
    }
  }

  ngOnDestroy(): void {
    // Ensure native dialog is closed if component is destroyed while open
    // (though Angular cleaning up the element usually handles it, explicit close is safer for modal state)
    if (this.dialogRef?.nativeElement?.open) {
      this.dialogRef.nativeElement.close();
    }
  }

  close() {
    this.open = false;
    this.openChange.emit(false);
    this.dialogRef.nativeElement.close();
  }

  onNativeClose() {
    this.open = false;
    this.openChange.emit(false);
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === this.dialogRef.nativeElement) {
      this.close();
    }
  }
}
