import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseUiComponent } from '../../core/base-component';

@Component({
    selector: 'platform-alert',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="alert" 
         [class.alert-info]="variant === 'primary'" 
         [class.alert-success]="variant === 'secondary'" 
         [class.alert-warning]="variant === 'outline'"
         [class.alert-error]="variant === 'danger'"
         role="alert">
      
      <div class="alert-icon" *ngIf="icon">
         <ng-content select="[icon]"></ng-content>
      </div>

      <div class="alert-content">
        <h4 *ngIf="title" class="alert-title">{{ title }}</h4>
        <div class="alert-message">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="alert-action" *ngIf="hasAction">
        <ng-content select="[action]"></ng-content>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
    .alert {
      display: flex;
      gap: var(--spacing-3);
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-md);
      border: 1px solid transparent;
      font-size: var(--text-sm);
    }

    /* Mapping variants to semantic meaning for Alert */
    /* primary -> info, secondary -> success, outline -> warning, danger -> error */
    /* Or we should introduce specific alert variants property. */
    /* For BaseUiComponent consistency, we use 'variant'. */
    
    .alert-info {
      background-color: var(--color-surface-50); 
      border-color: var(--color-border);
      color: var(--color-text-primary);
    }
    
    .alert-success {
      background-color: #ecfdf5; /* green-50 */
      border-color: #a7f3d0; /* green-200 */
      color: #064e3b; /* green-900 */
    }

    .alert-warning {
      background-color: #fffbeb; /* amber-50 */
      border-color: #fde68a; /* amber-200 */
      color: #78350f; /* amber-900 */
    }

    .alert-error {
      background-color: #fef2f2; /* red-50 */
      border-color: #fecaca; /* red-200 */
      color: #7f1d1d; /* red-900 */
    }

    .alert-content {
      flex: 1;
    }

    .alert-title {
      font-weight: var(--font-semibold);
      margin-bottom: var(--spacing-1);
    }
    
    .alert-icon {
      display: flex;
      align-items: flex-start;
      margin-top: 2px;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent extends BaseUiComponent {
    @Input() title?: string;
    @Input() icon = false;

    // variant inherited: primary (info), secondary (success), outline (warning), danger (error)
    // We might want to alias these inputs to be more semantic, e.g. @Input() type: 'info'|'success'...
    // But strictly following BaseUiComponent, we use variant.
    // I will map:
    // variant='primary' -> Info
    // variant='secondary' -> Success
    // variant='outline' -> Warning (weird mapping but consistent with plan "variants: primary, secondary, outline, danger")
    // variant='danger' -> Error

    get hasAction() {
        return true; // We assume if user projects [action] they want it.
    }
}
