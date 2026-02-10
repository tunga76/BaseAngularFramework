import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Input component with validation, accessibility, and form control support.
 * 
 * Features:
 * - Form control integration (ControlValueAccessor)
 * - Validation states (invalid, valid, pending)
 * - Label and error message support
 * - Prefix/suffix icons or text
 * - Multiple input types
 * - Disabled and readonly states
 * - Full accessibility (ARIA attributes)
 * 
 * @example
 * ```html
 * <!-- Basic input -->
 * <platform-input 
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   [(ngModel)]="email">
 * </platform-input>
 * 
 * <!-- With validation -->
 * <platform-input
 *   label="Password"
 *   type="password"
 *   [invalid]="hasError"
 *   errorMessage="Password is required">
 * </platform-input>
 * 
 * <!-- With prefix icon -->
 * <platform-input
 *   label="Search"
 *   prefixIcon="🔍"
 *   placeholder="Search...">
 * </platform-input>
 * ```
 */
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
    <div class="input-wrapper" [class.disabled]="disabled" [class.invalid]="invalid">
      <label *ngIf="label" [for]="inputId" class="input-label">
        {{ label }}
        <span *ngIf="required" class="required-indicator" aria-label="required">*</span>
      </label>
      
      <div class="input-container">
        <span *ngIf="prefixIcon || prefixText" class="input-prefix" aria-hidden="true">
          {{ prefixIcon || prefixText }}
        </span>
        
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [attr.aria-invalid]="invalid"
          [attr.aria-describedby]="errorMessage ? inputId + '-error' : null"
          [attr.aria-required]="required"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          (focus)="onFocus.emit($event)"
          class="input-field"
        />
        
        <span *ngIf="suffixIcon || suffixText" class="input-suffix" aria-hidden="true">
          {{ suffixIcon || suffixText }}
        </span>
      </div>
      
      <span 
        *ngIf="errorMessage && invalid" 
        [id]="inputId + '-error'" 
        class="error-message"
        role="alert">
        {{ errorMessage }}
      </span>
      
      <span *ngIf="helperText && !invalid" class="helper-text">
        {{ helperText }}
      </span>
    </div>
  `,
    styles: [`
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-family: inherit;
    }

    .input-label {
      font-size: var(--font-size-sm, 14px);
      font-weight: 500;
      color: var(--color-text, #111827);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .required-indicator {
      color: #ef4444;
    }

    .input-container {
      position: relative;
      display: flex;
      align-items: center;
      background-color: var(--color-surface, #ffffff);
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 6px);
      transition: all var(--transition-fast, 0.15s ease);
    }

    .input-container:focus-within {
      border-color: var(--color-primary, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .input-wrapper.invalid .input-container {
      border-color: #ef4444;
    }

    .input-wrapper.invalid .input-container:focus-within {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .input-wrapper.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .input-field {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      padding: 10px 12px;
      font-size: var(--font-size-md, 14px);
      color: var(--color-text, #111827);
      font-family: inherit;
    }

    .input-field::placeholder {
      color: var(--color-text-muted, #9ca3af);
    }

    .input-field:disabled {
      cursor: not-allowed;
    }

    .input-prefix,
    .input-suffix {
      padding: 0 12px;
      color: var(--color-text-muted, #9ca3af);
      font-size: var(--font-size-md, 14px);
      display: flex;
      align-items: center;
    }

    .error-message {
      font-size: var(--font-size-sm, 12px);
      color: #ef4444;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .helper-text {
      font-size: var(--font-size-sm, 12px);
      color: var(--color-text-muted, #6b7280);
    }

    /* Remove number input spinners */
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type="number"] {
      -moz-appearance: textfield;
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
    /** Unique identifier for the input */
    @Input() inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

    /** Label text displayed above input */
    @Input() label?: string;

    /** Input type */
    @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' = 'text';

    /** Placeholder text */
    @Input() placeholder = '';

    /** Whether the input is disabled */
    @Input() disabled = false;

    /** Whether the input is readonly */
    @Input() readonly = false;

    /** Whether the input is required */
    @Input() required = false;

    /** Whether the input is in an invalid state */
    @Input() invalid = false;

    /** Error message to display when invalid */
    @Input() errorMessage?: string;

    /** Helper text displayed below input */
    @Input() helperText?: string;

    /** Icon or text to display before input */
    @Input() prefixIcon?: string;

    /** Text to display before input */
    @Input() prefixText?: string;

    /** Icon or text to display after input */
    @Input() suffixIcon?: string;

    /** Text to display after input */
    @Input() suffixText?: string;

    /** Emitted when input receives focus */
    @Output() onFocus = new EventEmitter<FocusEvent>();

    /** Emitted when input value changes */
    @Output() valueChange = new EventEmitter<string>();

    /** Current input value */
    value = '';

    /** ControlValueAccessor callbacks */
    private onChange: (value: string) => void = () => { };
    onTouched: () => void = () => { };

    /**
     * Handles input events and updates the value.
     */
    onInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
        this.onChange(this.value);
        this.valueChange.emit(this.value);
    }

    // ControlValueAccessor implementation
    writeValue(value: string): void {
        this.value = value || '';
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
