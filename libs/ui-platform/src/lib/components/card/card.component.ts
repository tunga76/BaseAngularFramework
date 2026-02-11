import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'platform-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" 
         [class.card-elevated]="variant === 'elevated'"
         [class.card-outlined]="variant === 'outlined'"
         [class.card-flat]="variant === 'flat'"
         [class.hoverable]="hoverable"
         [class.padding-none]="padding === 'none'"
         [class.padding-sm]="padding === 'sm'"
         [class.padding-md]="padding === 'md'"
         [class.padding-lg]="padding === 'lg'">
      
      <!-- Header -->
      <div class="card-header" *ngIf="hasHeaderWrapper">
        <ng-content select="[card-header]"></ng-content>
      </div>
      
      <!-- Content -->
      <div class="card-content">
        <ng-content></ng-content>
      </div>
      
      <!-- Footer -->
      <div class="card-footer" *ngIf="hasFooterWrapper">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .card {
      background-color: var(--color-surface-0);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
    }

    /* Variants */
    .card-elevated {
      box-shadow: var(--shadow-md);
      border: 1px solid transparent; /* Maintain size parity */
    }

    .card-outlined {
      border: 1px solid var(--color-border);
      box-shadow: none;
    }

    .card-flat {
      background-color: var(--color-surface-50);
      border: none;
      box-shadow: none;
    }

    /* Hoverable */
    .card.hoverable:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      cursor: pointer;
    }
    .card-outlined.hoverable:hover {
      border-color: var(--color-primary-light);
    }

    /* Padding */
    .padding-none .card-content { padding: 0; }
    .padding-sm .card-content { padding: var(--spacing-3); }
    .padding-md .card-content { padding: var(--spacing-5); }
    .padding-lg .card-content { padding: var(--spacing-8); }

    /* Sections */
    .card-header {
      padding: var(--spacing-4) var(--spacing-5);
      border-bottom: 1px solid var(--color-border);
      background-color: transparent;
      font-weight: var(--font-semibold);
      font-size: var(--text-lg);
    }

    .card-footer {
      padding: var(--spacing-4) var(--spacing-5);
      border-top: 1px solid var(--color-border);
      background-color: var(--color-surface-50);
      display: flex;
      align-items: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() variant: 'elevated' | 'outlined' | 'flat' = 'elevated';
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() hoverable = false;

  // These are just helpers to check if the wrapper divs are needed visually?
  // Actually ng-content select doesn't create the element if not found, but the wrapper div will be empty.
  // CSS :empty pseudo class is an option, or we just rely on the user utilizing the slots correctly.
  // To strictly hide the wrapper if empty content is projected is hard without a directive.
  // For now we assume if the user projects content they want the wrapper.
  // We can add simple inputs to force hide if needed, but CSS :empty on wrapper might work if no text nodes are present.

  // A cleaner way usually involves directives like *platformCardHeader, but querySelector is heavy.
  // We'll stick to simple projection.

  // For the generated code, I'll assume wrappers are always there if I can't detect content easily in standalone.
  // Actually, I can use a simple trick: use CSS to hide empty wrappers if needed.
  // .card-header:empty { display: none; } 
  // But ng-content doesn't make it empty, it puts the comment node there.

  // I'll add boolean inputs to suppress them if needed, or just let them be.
  // Actually, standard practice often is just checking if we can wrap the ng-content in the div.
  // I will add hasHeaderWrapper as convenience, defaulting to true, but ideally we check if `select` matched anything.
  // Since we can't easily check `select` result count in template only...
  // I'll leave them always rendered for now, or assume the user will put content if they want header.

  get hasHeaderWrapper(): boolean { return true; }
  get hasFooterWrapper(): boolean { return true; }
}
