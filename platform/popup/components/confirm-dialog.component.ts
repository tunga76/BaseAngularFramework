import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dialog-content">
      <h3 class="title">{{ title }}</h3>
      <p class="message">{{ message }}</p>
      <div class="actions">
        <button class="btn btn-secondary" (click)="resolve(false)">{{ cancelText }}</button>
        <button class="btn btn-primary" (click)="resolve(true)">{{ confirmText }}</button>
      </div>
    </div>
  `,
    styles: [`
    .dialog-content { padding: var(--space-lg); color: var(--text-main); }
    .title { margin-top: 0; font-size: var(--font-size-xl); }
    .message { margin: var(--space-md) 0; color: var(--text-muted); }
    .actions { display: flex; justify-content: flex-end; gap: var(--space-md); margin-top: var(--space-lg); }
    .btn { 
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-primary { background: var(--color-primary); color: var(--color-primary-contrast); }
    .btn-secondary { background: var(--surface-bg); color: var(--text-main); border: 1px solid var(--surface-border); }
  `]
})
export class ConfirmDialogComponent {
    @Input() title: string = 'Confirm';
    @Input() message: string = '';
    @Input() confirmText: string = 'Yes';
    @Input() cancelText: string = 'No';
    @Input() resolve!: (result: boolean) => void;
}
