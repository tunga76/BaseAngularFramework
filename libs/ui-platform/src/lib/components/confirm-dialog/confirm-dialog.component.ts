import { Component, Injectable, Input, Output, EventEmitter, ChangeDetectionStrategy, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service'; // Assuming we use modal service to open it logic
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component'; // Ensure button is available

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {
    // Logic to open confirm dialog.
    // Since our ModalService is basic (doesn't dynamically creating components yet), 
    // we might need to place <platform-confirm-dialog> in the root and control it via signal.

    // Actually, let's implement the ConfirmDialogComponent and users can use it with Modal.
    // Or simpler: The ConfirmDialogComponent IS a wrapper around ModalComponent that connects to this service.

    // Let's go with a signal-based service that a single global ConfirmDialog listens to.

    private _state = signal<{
        open: boolean;
        title: string;
        message: string;
        confirmText: string;
        cancelText: string;
        resolve?: (result: boolean) => void;
    }>({
        open: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel'
    });

    readonly state = this._state.asReadonly();

    confirm(options: {
        title?: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
    }): Promise<boolean> {
        return new Promise((resolve) => {
            this._state.set({
                open: true,
                title: options.title || 'Confirm',
                message: options.message,
                confirmText: options.confirmText || 'Confirm',
                cancelText: options.cancelText || 'Cancel',
                resolve
            });
        });
    }

    close(result: boolean) {
        const current = this._state();
        if (current.resolve) {
            current.resolve(result);
        }
        this._state.update(s => ({ ...s, open: false }));
    }
}

// Need to import signals from core
import { signal } from '@angular/core';

@Component({
    selector: 'platform-confirm-dialog',
    standalone: true,
    imports: [CommonModule, ModalComponent, ButtonComponent],
    template: `
    <platform-modal 
      [open]="service.state().open" 
      [title]="service.state().title"
      size="sm"
      (onClose)="cancel()">
      
      <p>{{ service.state().message }}</p>
      
      <div modal-footer class="actions">
        <platform-button variant="ghost" (onClick)="cancel()">
          {{ service.state().cancelText }}
        </platform-button>
        <platform-button variant="primary" (onClick)="confirm()" autoFocus>
          {{ service.state().confirmText }}
        </platform-button>
      </div>
    </platform-modal>
  `,
    styles: [`
    .actions {
      display: flex;
      gap: var(--spacing-2);
      justify-content: flex-end;
      width: 100%;
    }
    p { margin: 0; color: var(--color-text-secondary); }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
    constructor(public service: ConfirmDialogService) { }

    confirm() {
        this.service.close(true);
    }

    cancel() {
        this.service.close(false);
    }
}
