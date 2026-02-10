import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Chip component for displaying tags, filters, or removable items.
 * 
 * Features:
 * - Removable with close button
 * - Multiple variants
 * - Avatar support
 * - Keyboard accessible
 * 
 * @example
 * ```html
 * <platform-chip>Default Chip</platform-chip>
 * 
 * <platform-chip 
 *   [removable]="true" 
 *   (onRemove)="handleRemove()">
 *   Removable
 * </platform-chip>
 * 
 * <platform-chip variant="primary" avatar="👤">
 *   User Name
 * </platform-chip>
 * ```
 */
@Component({
    selector: 'platform-chip',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div [class]="getChipClasses()" role="listitem">
      <span *ngIf="avatar" class="chip-avatar" aria-hidden="true">
        {{ avatar }}
      </span>
      
      <span class="chip-content">
        <ng-content></ng-content>
      </span>
      
      <button
        *ngIf="removable"
        type="button"
        class="chip-remove"
        (click)="handleRemove($event)"
        (keydown.enter)="handleRemove($event)"
        (keydown.space)="handleRemove($event)"
        [attr.aria-label]="'Remove chip'"
        tabindex="0">
        ✕
      </button>
    </div>
  `,
    styles: [`
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: var(--radius-md, 16px);
      font-size: var(--font-size-sm, 13px);
      font-weight: 500;
      font-family: inherit;
      border: 1px solid transparent;
      transition: all var(--transition-fast, 0.15s ease);
      max-width: 100%;
    }

    /* Variants */
    .chip-default {
      background-color: var(--color-background, #f3f4f6);
      color: var(--color-text, #374151);
      border-color: var(--color-border, #e5e7eb);
    }

    .chip-primary {
      background-color: #dbeafe;
      color: #1e40af;
      border-color: #93c5fd;
    }

    .chip-success {
      background-color: #d1fae5;
      color: #065f46;
      border-color: #6ee7b7;
    }

    .chip-warning {
      background-color: #fef3c7;
      color: #92400e;
      border-color: #fcd34d;
    }

    .chip-danger {
      background-color: #fee2e2;
      color: #991b1b;
      border-color: #fca5a5;
    }

    .chip-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xs, 12px);
      flex-shrink: 0;
    }

    .chip-content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chip-remove {
      background: none;
      border: none;
      padding: 0;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
      color: currentColor;
      opacity: 0.7;
      transition: all var(--transition-fast, 0.15s ease);
      flex-shrink: 0;
    }

    .chip-remove:hover {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.1);
    }

    .chip-remove:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
      opacity: 1;
    }

    .chip-size-sm {
      padding: 4px 8px;
      font-size: var(--font-size-xs, 11px);
    }

    .chip-size-md {
      padding: 6px 12px;
      font-size: var(--font-size-sm, 13px);
    }

    .chip-size-lg {
      padding: 8px 14px;
      font-size: var(--font-size-md, 14px);
    }
  `]
})
export class ChipComponent {
    /** Chip variant */
    @Input() variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' = 'default';

    /** Chip size */
    @Input() size: 'sm' | 'md' | 'lg' = 'md';

    /** Whether the chip can be removed */
    @Input() removable = false;

    /** Avatar text or emoji */
    @Input() avatar?: string;

    /** Emitted when chip is removed */
    @Output() onRemove = new EventEmitter<void>();

    handleRemove(event: Event): void {
        event.stopPropagation();
        this.onRemove.emit();
    }

    getChipClasses(): string {
        return [
            'chip',
            `chip-${this.variant}`,
            `chip-size-${this.size}`
        ].join(' ');
    }
}
