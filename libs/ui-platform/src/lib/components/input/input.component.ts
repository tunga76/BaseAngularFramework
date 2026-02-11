import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy, ElementRef, ViewChild, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseUiComponent } from '../../core/base-component';

@Component({
  selector: 'platform-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-container" 
         [class.focused]="focused" 
         [class.disabled]="disabled" 
         [class.invalid]="errorState"
         [class.size-sm]="size === 'sm'"
         [class.size-md]="size === 'md'"
         [class.size-lg]="size === 'lg'">
      
      <!-- Prefix -->
      <span class="prefix" *ngIf="prefixIcon || prefixText">
        <ng-content select="[prefix]"></ng-content>
        {{ prefixText }}
        <span *ngIf="prefixIcon" [class]="prefixIcon"></span>
      </span>

      <input
        #inputElement
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [readonly]="readonly"
        [value]="value"
        [attr.id]="inputId"
        (input)="onInput(inputElement.value)"
        (blur)="onBlur()"
        (focus)="onFocus($any($event))"
        class="native-input"
      />

      <!-- Suffix -->
      <span class="suffix" *ngIf="suffixIcon || suffixText">
        <ng-content select="[suffix]"></ng-content>
        {{ suffixText }}
        <span *ngIf="suffixIcon" [class]="suffixIcon"></span>
      </span>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .input-container {
      display: flex;
      align-items: center;
      background-color: var(--color-surface-0);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      transition: all 0.2s ease;
      width: 100%;
      overflow: hidden;
    }

    .input-container:hover:not(.disabled) {
      border-color: var(--color-border-hover);
    }

    .input-container.focused {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px var(--color-primary-light); /* Opacity handled by color or use rgba */
      outline: none;
    }

    .input-container.invalid {
      border-color: var(--color-error);
    }
    .input-container.invalid.focused {
       box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
    }

    .input-container.disabled {
      background-color: var(--color-surface-100);
      cursor: not-allowed;
      opacity: 0.7;
    }

    .native-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      padding: 0;
      color: var(--color-text-primary);
      font-family: inherit;
      width: 100%;
      height: 100%; /* Ensure full height */
    }
    
    .native-input::placeholder {
      color: var(--color-text-secondary);
      opacity: 0.7;
    }

    .prefix, .suffix {
      display: flex;
      align-items: center;
      color: var(--color-text-secondary);
      white-space: nowrap;
      height: 100%;
      align-self: center;
    }

    /* Sizes */
    .size-sm {
      padding: 0 var(--spacing-2);
      height: 2rem;
      font-size: var(--text-xs);
    }
    .size-sm .native-input { font-size: var(--text-xs); }

    .size-md {
      padding: 0 var(--spacing-3);
      height: 2.5rem;
      font-size: var(--text-sm);
    }
    .size-md .native-input { font-size: var(--text-sm); }

    .size-lg {
      padding: 0 var(--spacing-4);
      height: 3rem;
      font-size: var(--text-base);
    }
    .size-lg .native-input { font-size: var(--text-base); }
    
    .prefix { margin-right: var(--spacing-2); }
    .suffix { margin-left: var(--spacing-2); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent extends BaseUiComponent implements ControlValueAccessor {
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() readonly = false;
  @Input() inputId = '';

  @Input() prefixText?: string;
  @Input() prefixIcon?: string;
  @Input() suffixText?: string;
  @Input() suffixIcon?: string;

  /** Manually force error state */
  @Input() errorState = false;

  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() blur = new EventEmitter<void>();

  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  value = '';
  focused = false;

  onChange = (value: string) => { };
  onTouched = () => { };

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  onFocus(event: FocusEvent): void {
    this.focused = true;
    this.focus.emit(event);
  }

  onBlur(): void {
    this.focused = false;
    this.onTouched();
    this.blur.emit();
  }
}
