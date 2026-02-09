import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'platform-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button 
      [type]="type"
      [class]="'btn btn-' + variant + ' btn-' + size"
      [disabled]="disabled"
      (click)="onClick.emit($event)">
      <ng-content></ng-content>
    </button>
  `,
    styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-family: inherit;
      border: none;
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: var(--transition-fast);
      font-size: var(--font-size-md);
      gap: 8px;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Variants */
    .btn-primary {
      background-color: var(--color-primary);
      color: white;
    }
    .btn-primary:hover:not(:disabled) {
      filter: brightness(1.1);
    }

    .btn-secondary {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text);
    }
    .btn-secondary:hover:not(:disabled) {
      background-color: var(--color-background);
    }

    .btn-ghost {
      background-color: transparent;
      color: var(--color-primary);
    }
    .btn-ghost:hover:not(:disabled) {
      background-color: rgba(var(--color-primary-rgb), 0.1);
    }

    /* Sizes */
    .btn-sm { padding: 6px 12px; font-size: var(--font-size-sm); }
    .btn-md { padding: 10px 20px; }
    .btn-lg { padding: 14px 28px; font-size: var(--font-size-lg); }
  `]
})
export class ButtonComponent {
    @Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary';
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() type: 'button' | 'submit' = 'button';
    @Input() disabled = false;
    @Output() onClick = new EventEmitter<MouseEvent>();
}
