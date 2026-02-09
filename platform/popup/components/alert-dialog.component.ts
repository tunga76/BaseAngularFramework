import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-alert-dialog',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dialog-content">
      <h3 class="title">{{ title }}</h3>
      <p class="message">{{ message }}</p>
      <div class="actions">
        <button class="btn btn-primary" (click)="resolve()">{{ confirmText }}</button>
      </div>
    </div>
  `,
    styles: [`
    .dialog-content { padding: var(--space-lg); color: var(--text-main); }
    .title { margin-top: 0; font-size: var(--font-size-xl); }
    .message { margin: var(--space-md) 0; color: var(--text-muted); }
    .actions { display: flex; justify-content: flex-end; margin-top: var(--space-lg); }
    .btn { 
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-primary { background: var(--color-primary); color: var(--color-primary-contrast); }
  `]
})
export class AlertDialogComponent {
    @Input() title: string = 'Alert';
    @Input() message: string = '';
    @Input() confirmText: string = 'OK';
    @Input() resolve!: (result?: any) => void;
}
