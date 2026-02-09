import { Component, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService } from '../services/popup.service';
import { AlertDialogComponent } from './alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
    selector: 'app-modal-host',
    standalone: true,
    imports: [CommonModule, AlertDialogComponent, ConfirmDialogComponent],
    template: `
    <div *ngFor="let modal of modals$ | async; let i = index" 
         class="modal-overlay" 
         [style.zIndex]="9000 + i">
      <div class="modal-container" [style.width]="modal.options.width || '500px'">
        
        <ng-container *ngIf="modal.options.type === 'alert'">
          <app-alert-dialog 
            [title]="modal.options.title || 'Alert'" 
            [message]="modal.options.message || ''" 
            [confirmText]="modal.options.confirmText || 'OK'"
            [resolve]="modal.resolve">
          </app-alert-dialog>
        </ng-container>

        <ng-container *ngIf="modal.options.type === 'confirm'">
          <app-confirm-dialog 
            [title]="modal.options.title || 'Confirm'" 
            [message]="modal.options.message || ''" 
            [confirmText]="modal.options.confirmText || 'Yes'"
            [cancelText]="modal.options.cancelText || 'No'"
            [resolve]="modal.resolve">
          </app-confirm-dialog>
        </ng-container>

        <ng-container *ngIf="modal.component">
           <ng-container *ngComponentOutlet="modal.component; inputs: { options: modal.options, resolve: modal.resolve }"></ng-container>
        </ng-container>

      </div>
    </div>
  `,
    styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--overlay-bg);
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(4px);
    }

    .modal-container {
      background: var(--surface-paper);
      border-radius: var(--radius-lg);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border: 1px solid var(--surface-border);
      max-width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
      animation: modalEnter 0.2s ease-out;
    }

    @keyframes modalEnter {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class ModalHostComponent {
    modals$ = this.popupService.modals$;

    constructor(private popupService: PopupService) { }
}
