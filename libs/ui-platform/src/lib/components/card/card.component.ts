import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Card component for grouping related content.
 * 
 * Provides a flexible container with slots for header, content, and footer.
 * Supports hover effects and clickable cards.
 * 
 * @example
 * ```html
 * <platform-card>
 *   <div card-header>
 *     <h3>Card Title</h3>
 *   </div>
 *   <div card-content>
 *     <p>Card content goes here</p>
 *   </div>
 *   <div card-footer>
 *     <platform-button>Action</platform-button>
 *   </div>
 * </platform-card>
 * 
 * <!-- Hoverable card -->
 * <platform-card [hoverable]="true">
 *   <div card-content>Hover me!</div>
 * </platform-card>
 * ```
 */
@Component({
    selector: 'platform-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="card" 
         [class.hoverable]="hoverable"
         [class.padded]="padded"
         role="article">
      <div *ngIf="hasHeader" class="card-header">
        <ng-content select="[card-header]"></ng-content>
      </div>
      
      <div class="card-content">
        <ng-content select="[card-content]"></ng-content>
        <ng-content></ng-content>
      </div>
      
      <div *ngIf="hasFooter" class="card-footer">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
    styles: [`
    .card {
      background-color: var(--color-surface, #ffffff);
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      overflow: hidden;
      transition: all var(--transition-md, 0.2s ease);
    }

    .card.hoverable:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                  0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);
      border-color: var(--color-border-hover, #d1d5db);
      cursor: pointer;
    }

    .card-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-border, #e5e7eb);
      background-color: var(--color-background, #f9fafb);
    }

    .card-content {
      padding: 20px;
    }

    .card.padded .card-content {
      padding: 24px;
    }

    .card-footer {
      padding: 12px 20px;
      border-top: 1px solid var(--color-border, #e5e7eb);
      background-color: var(--color-background, #f9fafb);
      display: flex;
      align-items: center;
      gap: 12px;
    }
  `]
})
export class CardComponent {
    /** Whether the card should have hover effects */
    @Input() hoverable = false;

    /** Whether to add extra padding to content */
    @Input() padded = false;

    /** Internal flag for header presence */
    hasHeader = true;

    /** Internal flag for footer presence */
    hasFooter = true;
}
