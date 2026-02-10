import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Spinner component for loading states.
 * 
 * Features:
 * - Multiple sizes
 * - Different variants (spinner, dots, pulse)
 * - Overlay mode for full-screen loading
 * - Accessible with ARIA attributes
 * 
 * @example
 * ```html
 * <!-- Basic spinner -->
 * <platform-spinner></platform-spinner>
 * 
 * <!-- Large spinner with label -->
 * <platform-spinner size="lg" label="Loading..."></platform-spinner>
 * 
 * <!-- Overlay mode -->
 * <platform-spinner [overlay]="true" label="Please wait..."></platform-spinner>
 * 
 * <!-- Dots variant -->
 * <platform-spinner variant="dots"></platform-spinner>
 * ```
 */
@Component({
    selector: 'platform-spinner',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="overlay" class="spinner-overlay" (click)="$event.stopPropagation()">
      <div class="spinner-overlay-content">
        <div [class]="getSpinnerClasses()" role="status" [attr.aria-label]="label || 'Loading'">
          <ng-container *ngTemplateOutlet="spinnerContent"></ng-container>
        </div>
        <p *ngIf="label" class="spinner-label">{{ label }}</p>
      </div>
    </div>
    
    <div *ngIf="!overlay" [class]="getSpinnerClasses()" role="status" [attr.aria-label]="label || 'Loading'">
      <ng-container *ngTemplateOutlet="spinnerContent"></ng-container>
      <span *ngIf="label" class="spinner-label">{{ label }}</span>
    </div>

    <ng-template #spinnerContent>
      <div *ngIf="variant === 'spinner'" class="spinner-circle"></div>
      <div *ngIf="variant === 'dots'" class="spinner-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <div *ngIf="variant === 'pulse'" class="spinner-pulse"></div>
    </ng-template>
  `,
    styles: [`
    .spinner {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .spinner-label {
      font-size: var(--font-size-sm, 13px);
      color: var(--color-text-muted, #6b7280);
      margin: 0;
    }

    /* Spinner Circle */
    .spinner-circle {
      border: 3px solid rgba(59, 130, 246, 0.2);
      border-top-color: var(--color-primary, #3b82f6);
      border-radius: 50%;
      animation: spinner-rotate 0.8s linear infinite;
    }

    .spinner-sm .spinner-circle {
      width: 20px;
      height: 20px;
      border-width: 2px;
    }

    .spinner-md .spinner-circle {
      width: 32px;
      height: 32px;
      border-width: 3px;
    }

    .spinner-lg .spinner-circle {
      width: 48px;
      height: 48px;
      border-width: 4px;
    }

    @keyframes spinner-rotate {
      to { transform: rotate(360deg); }
    }

    /* Dots Variant */
    .spinner-dots {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .spinner-dots .dot {
      background-color: var(--color-primary, #3b82f6);
      border-radius: 50%;
      animation: dot-bounce 1.4s infinite ease-in-out both;
    }

    .spinner-sm .spinner-dots .dot {
      width: 6px;
      height: 6px;
    }

    .spinner-md .spinner-dots .dot {
      width: 10px;
      height: 10px;
    }

    .spinner-lg .spinner-dots .dot {
      width: 14px;
      height: 14px;
    }

    .spinner-dots .dot:nth-child(1) {
      animation-delay: -0.32s;
    }

    .spinner-dots .dot:nth-child(2) {
      animation-delay: -0.16s;
    }

    @keyframes dot-bounce {
      0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.6;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* Pulse Variant */
    .spinner-pulse {
      background-color: var(--color-primary, #3b82f6);
      border-radius: 50%;
      animation: pulse-scale 1.5s ease-in-out infinite;
    }

    .spinner-sm .spinner-pulse {
      width: 20px;
      height: 20px;
    }

    .spinner-md .spinner-pulse {
      width: 32px;
      height: 32px;
    }

    .spinner-lg .spinner-pulse {
      width: 48px;
      height: 48px;
    }

    @keyframes pulse-scale {
      0%, 100% {
        transform: scale(0.8);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
    }

    /* Overlay Mode */
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease;
    }

    .spinner-overlay-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .spinner-overlay .spinner-label {
      color: white;
      font-size: var(--font-size-md, 14px);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class SpinnerComponent {
    /** Spinner size */
    @Input() size: 'sm' | 'md' | 'lg' = 'md';

    /** Spinner variant */
    @Input() variant: 'spinner' | 'dots' | 'pulse' = 'spinner';

    /** Optional label text */
    @Input() label?: string;

    /** Whether to show as full-screen overlay */
    @Input() overlay = false;

    getSpinnerClasses(): string {
        return `spinner spinner-${this.size}`;
    }
}
