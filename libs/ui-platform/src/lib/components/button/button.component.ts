import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseUiComponent } from '../../core/base-component';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'platform-button',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  template: `
    <button 
      [type]="type"
      class="btn"
      [class]="getButtonClasses()"
      [disabled]="disabled || loading"
      [attr.aria-label]="ariaLabel"
      [attr.aria-busy]="loading"
      [attr.aria-disabled]="disabled || loading"
      (click)="handleClick($event)">
      
      <!-- Loading Spinner -->
      <span *ngIf="loading" class="btn-spinner">
        <platform-spinner [size]="'sm'" [variant]="'spinner'" [label]="''"></platform-spinner>
      </span>

      <!-- Content -->
      <span class="btn-content" [class.invisible]="loading && hideContentWhenLoading">
        <ng-content></ng-content>
      </span>
      
      <!-- Icon Slot (Optional, usage: <span slot="icon">...</span> if using shadow dom, but here ng-content select) -->
      <span class="btn-icon" *ngIf="icon">
        <ng-content select="[icon]"></ng-content>
      </span>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    :host(.full-width) {
      width: 100%;
      display: block;
    }

    .btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-medium);
      font-family: var(--font-sans);
      border: 1px solid transparent;
      cursor: pointer;
      border-radius: var(--radius-lg);
      transition: all 0.2s ease;
      gap: var(--spacing-2);
      white-space: nowrap;
      user-select: none;
      width: 100%; /* For full width host */
    }
    
    :host:not(.full-width) .btn {
      width: auto;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Sizes */
    .btn-sm { 
      padding: var(--spacing-1) var(--spacing-3); 
      font-size: var(--text-xs); 
      height: 2rem;
    }

    .btn-md { 
      padding: var(--spacing-2) var(--spacing-4); 
      font-size: var(--text-sm); 
      height: 2.5rem;
    }

    .btn-lg { 
      padding: var(--spacing-3) var(--spacing-6); 
      font-size: var(--text-base); 
      height: 3rem;
    }

    /* Variants */
    .btn-primary {
      background-color: var(--color-primary);
      color: var(--color-primary-contrast);
      border-color: transparent;
    }
    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-primary-dark);
    }

    .btn-secondary {
      background-color: var(--color-secondary);
      color: var(--color-secondary-contrast);
    }
    .btn-secondary:hover:not(:disabled) {
      background-color: var(--color-secondary-dark);
    }

    .btn-outline {
      background-color: transparent;
      border-color: var(--color-border);
      color: var(--color-text-primary);
    }
    .btn-outline:hover:not(:disabled) {
      background-color: var(--color-surface-100);
      border-color: var(--color-border-hover);
    }

    .btn-ghost {
      background-color: transparent;
      color: var(--color-text-primary);
    }
    .btn-ghost:hover:not(:disabled) {
      background-color: var(--color-surface-100);
    }

    .btn-danger {
      background-color: var(--color-error);
      color: white;
    }
    .btn-danger:hover:not(:disabled) {
      filter: brightness(0.9);
    }

    /* Loading */
    .btn-spinner {
      display: flex;
      align-items: center;
    }

    .invisible {
      visibility: hidden;
    }
    
    .btn-content {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent extends BaseUiComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() ariaLabel?: string;
  @Input() hideContentWhenLoading = false;
  @Input() icon = false; // Flag to check if icon slot is used, or just rely on ng-content styling

  @Output() onClick = new EventEmitter<MouseEvent>();

  override get baseClasses(): string[] {
    // We construct classes in getButtonClasses instead for the inner button
    return [];
  }

  getButtonClasses(): string {
    return [
      `btn-${this.variant}`,
      `btn-${this.size}`
    ].join(' ');
  }

  handleClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.onClick.emit(event);
  }
}
