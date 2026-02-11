import { Component, Input, ContentChild, ChangeDetectionStrategy, signal, AfterContentInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'platform-form-field',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="form-field" [class.has-error]="hasError()">
      <label *ngIf="label" class="label">
        {{ label }}
        <span *ngIf="required" class="required">*</span>
      </label>

      <div class="field-content">
        <ng-content></ng-content>
      </div>

      <div class="messages">
        <span *ngIf="hasError()" class="error-msg" role="alert">
          {{ currentErrorMessage }}
        </span>
        <span *ngIf="hint && !hasError()" class="hint-msg">
          {{ hint }}
        </span>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      margin-bottom: var(--spacing-4);
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }
    .label {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--color-text-primary);
      display: flex;
      align-items: center;
    }
    .required {
      color: var(--color-error);
      margin-left: 2px;
    }
    .messages {
      min-height: 1.25rem; /* Reserve space or let it collapse */
      font-size: var(--text-xs);
      margin-top: 2px;
    }
    .error-msg {
      color: var(--color-error);
    }
    .hint-msg {
      color: var(--color-text-secondary);
    }
    .has-error .label {
      color: var(--color-error);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent implements AfterContentInit, OnDestroy {
    @Input() label?: string;
    @Input() hint?: string;
    @Input() required = false;

    @ContentChild(NgControl) ngControl?: NgControl;

    private destroy$ = new Subject<void>();
    private _explicitError: string | null = null;
    @Input() set errorMessage(val: string | null) {
        this._explicitError = val;
        this.cdr.markForCheck();
    }

    constructor(private cdr: ChangeDetectorRef) { }

    ngAfterContentInit() {
        if (this.ngControl) {
            if (this.ngControl.statusChanges) {
                this.ngControl.statusChanges
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.cdr.markForCheck();
                    });
            }
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    hasError(): boolean {
        if (this._explicitError) return true;
        if (this.ngControl) {
            return !!(this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty));
        }
        return false;
    }

    get currentErrorMessage(): string {
        if (this._explicitError) return this._explicitError;
        if (this.ngControl?.errors) {
            const errors = this.ngControl.errors;
            if (errors['required']) return 'This field is required';
            if (errors['email']) return 'Invalid email address';
            if (errors['minlength']) return `Min length is ${errors['minlength'].requiredLength}`;
            return 'Invalid field';
        }
        return '';
    }
}
