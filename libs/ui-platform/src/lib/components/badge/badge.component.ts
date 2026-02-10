import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Badge component for displaying status, counts, or labels.
 * 
 * Features:
 * - Multiple variants (primary, success, warning, danger, info)
 * - Different sizes
 * - Dot variant for minimal display
 * 
 * @example
 * ```html
 * <platform-badge variant="success">Active</platform-badge>
 * <platform-badge variant="danger">3</platform-badge>
 * <platform-badge [dot]="true"></platform-badge>
 * ```
 */
@Component({
    selector: 'platform-badge',
    standalone: true,
    imports: [CommonModule],
    template: `
    <span 
      [class]="getBadgeClasses()"
      [attr.aria-label]="ariaLabel"
      role="status">
      <span *ngIf="!dot" class="badge-content">
        <ng-content></ng-content>
      </span>
    </span>
  `,
    styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-family: inherit;
      border-radius: var(--radius-md, 12px);
      white-space: nowrap;
      transition: all var(--transition-fast, 0.15s ease);
    }

    /* Sizes */
    .badge-sm {
      padding: 2px 8px;
      font-size: var(--font-size-xs, 10px);
      min-height: 18px;
    }

    .badge-md {
      padding: 4px 10px;
      font-size: var(--font-size-sm, 12px);
      min-height: 22px;
    }

    .badge-lg {
      padding: 6px 12px;
      font-size: var(--font-size-md, 14px);
      min-height: 26px;
    }

    /* Variants */
    .badge-primary {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .badge-success {
      background-color: #d1fae5;
      color: #065f46;
    }

    .badge-warning {
      background-color: #fef3c7;
      color: #92400e;
    }

    .badge-danger {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .badge-info {
      background-color: #e0e7ff;
      color: #3730a3;
    }

    .badge-neutral {
      background-color: var(--color-background, #f3f4f6);
      color: var(--color-text, #374151);
    }

    /* Dot variant */
    .badge-dot {
      width: 8px;
      height: 8px;
      min-height: 8px;
      padding: 0;
      border-radius: 50%;
    }

    .badge-dot.badge-primary {
      background-color: #3b82f6;
    }

    .badge-dot.badge-success {
      background-color: #10b981;
    }

    .badge-dot.badge-warning {
      background-color: #f59e0b;
    }

    .badge-dot.badge-danger {
      background-color: #ef4444;
    }

    .badge-dot.badge-info {
      background-color: #6366f1;
    }
  `]
})
export class BadgeComponent {
    /** Badge variant */
    @Input() variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' = 'neutral';

    /** Badge size */
    @Input() size: 'sm' | 'md' | 'lg' = 'md';

    /** Show as dot instead of text */
    @Input() dot = false;

    /** Custom ARIA label */
    @Input() ariaLabel?: string;

    getBadgeClasses(): string {
        const classes = ['badge', `badge-${this.variant}`, `badge-${this.size}`];
        if (this.dot) {
            classes.push('badge-dot');
        }
        return classes.join(' ');
    }
}
