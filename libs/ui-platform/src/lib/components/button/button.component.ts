import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable button component with multiple variants, sizes, and accessibility support.
 * 
 * Features:
 * - Multiple variants (primary, secondary, ghost, danger)
 * - Three sizes (sm, md, lg)
 * - Loading state with spinner
 * - Full accessibility (ARIA, keyboard nav)
 * - Full-width option
 * 
 * @example
 * ```html
 * <!-- Primary button -->
 * <platform-button variant="primary" (onClick)="save()">
 *   Save Changes
 * </platform-button>
 * 
 * <!-- Loading state -->
 * <platform-button [loading]="isSubmitting" (onClick)="submit()">
 *   Submit
 * </platform-button>
 * 
 * <!-- With custom ARIA label -->
 * <platform-button variant="ghost" ariaLabel="Close dialog">
 *   <i class="icon-close"></i>
 * </platform-button>
 * ```
 */
@Component({
  selector: 'platform-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type"
      [class]="getButtonClasses()"
      [disabled]="disabled || loading"
      [attr.aria-label]="ariaLabel"
      [attr.aria-busy]="loading"
      [attr.aria-disabled]="disabled || loading"
      (click)="handleClick($event)">
      <span *ngIf="loading" class="spinner" aria-hidden="true"></span>
      <span class="button-content" [class.sr-only]="loading && hideContentWhenLoading">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: [`
    .btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-family: inherit;
      border: none;
      cursor: pointer;
      border-radius: var(--radius-md, 6px);
      transition: all var(--transition-fast, 0.15s ease);
      font-size: var(--font-size-md, 14px);
      gap: 8px;
      white-space: nowrap;
      user-select: none;
    }

    .btn:focus-visible {
      outline: 2px solid var(--color-primary, #3b82f6);
      outline-offset: 2px;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn.full-width {
      width: 100%;
    }

    /* Variants */
    .btn-primary {
      background-color: var(--color-primary, #3b82f6);
      color: white;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .btn-primary:hover:not(:disabled) {
      filter: brightness(1.1);
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    }

    .btn-primary:active:not(:disabled) {
      filter: brightness(0.95);
    }

    .btn-secondary {
      background-color: var(--color-surface, #f9fafb);
      border: 1px solid var(--color-border, #e5e7eb);
      color: var(--color-text, #111827);
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: var(--color-background, #f3f4f6);
      border-color: var(--color-border-hover, #d1d5db);
    }

    .btn-ghost {
      background-color: transparent;
      color: var(--color-primary, #3b82f6);
    }

    .btn-ghost:hover:not(:disabled) {
      background-color: rgba(59, 130, 246, 0.1);
    }

    .btn-danger {
      background-color: #ef4444;
      color: white;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #dc2626;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    }

    /* Sizes */
    .btn-sm { 
      padding: 6px 12px; 
      font-size: var(--font-size-sm, 12px); 
      min-height: 32px;
    }

    .btn-md { 
      padding: 10px 20px; 
      min-height: 40px;
    }

    .btn-lg { 
      padding: 14px 28px; 
      font-size: var(--font-size-lg, 16px); 
      min-height: 48px;
    }

    /* Loading spinner */
    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spinner-rotate 0.6s linear infinite;
    }

    @keyframes spinner-rotate {
      to { transform: rotate(360deg); }
    }

    /* Screen reader only class */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    .button-content {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class ButtonComponent {
  /**
   * Button visual variant.
   * @default 'primary'
   */
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';

  /**
   * Button size.
   * @default 'md'
   */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * HTML button type.
   * @default 'button'
   */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * Whether the button is disabled.
   * @default false
   */
  @Input() disabled = false;

  /**
   * Whether the button is in loading state.
   * Shows a spinner and disables interaction.
   * @default false
   */
  @Input() loading = false;

  /**
   * Whether to expand button to full width of container.
   * @default false
   */
  @Input() fullWidth = false;

  /**
   * Custom ARIA label for accessibility.
   * Use when button content is not descriptive (e.g., icon-only buttons).
   */
  @Input() ariaLabel?: string;

  /**
   * Whether to hide button content (text) when loading.
   * If true, only spinner is shown when loading.
   * @default false
   */
  @Input() hideContentWhenLoading = false;

  /**
   * Emitted when button is clicked.
   * Does not emit when button is disabled or loading.
   */
  @Output() onClick = new EventEmitter<MouseEvent>();

  /**
   * Handles click events and keyboard activation (Enter/Space).
   * Prevents event propagation when button is disabled or loading.
   * 
   * @param event - Mouse or keyboard event
   */
  handleClick(event: MouseEvent | KeyboardEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.onClick.emit(event as MouseEvent);
  }

  /**
   * Keyboard event handler for Enter and Space keys.
   * Clicks the button when activated via keyboard.
   * 
   * @param event - Keyboard event
   */
  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeydown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === ' ') {
      // Prevent page scroll on space
      event.preventDefault();
    }
    this.handleClick(keyboardEvent);
  }

  /**
   * Generates CSS classes for the button based on inputs.
   * 
   * @returns Space-separated class string
   */
  getButtonClasses(): string {
    const classes = [
      'btn',
      `btn-${this.variant}`,
      `btn-${this.size}`
    ];

    if (this.fullWidth) {
      classes.push('full-width');
    }

    return classes.join(' ');
  }
}
