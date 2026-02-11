import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseUiComponent } from '../../core/base-component';

@Component({
  selector: 'platform-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" 
          [class]="getBadgeClasses()"
          [class.badge-dot]="dot">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    :host {
      display: inline-flex;
      vertical-align: middle;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.125rem 0.5rem;
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-weight: var(--font-medium);
      line-height: 1;
      white-space: nowrap;
    }
    
    /* Variants */
    .badge-primary {
      background-color: var(--color-primary);
      color: var(--color-primary-contrast);
    }
    
    .badge-secondary {
      background-color: var(--color-secondary);
      color: var(--color-secondary-contrast);
    }
    
    .badge-outline {
      background-color: transparent;
      border: 1px solid var(--color-border);
      color: var(--color-text-secondary);
    }
    
    .badge-danger {
      background-color: var(--color-error);
      color: white;
    }
    
    .badge-ghost {
      background-color: var(--color-surface-200);
      color: var(--color-text-secondary);
    }

    /* Sizes */
    .badge-sm { font-size: 0.625rem; padding: 2px 4px; }
    .badge-md { font-size: 0.75rem; padding: 2px 8px; }
    .badge-lg { font-size: 0.875rem; padding: 4px 10px; }
    
    /* Dot Badge */
    .badge-dot {
      width: 8px;
      height: 8px;
      padding: 0;
      border-radius: 50%;
      min-width: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent extends BaseUiComponent {
  /** Display as a small dot indicator */
  @Input() dot = false;

  getBadgeClasses(): string {
    return `badge-${this.variant} badge-${this.size}`;
  }
}
