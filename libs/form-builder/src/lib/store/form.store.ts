import { Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface FormState {
    loading: boolean;
    submitting: boolean;
    backendErrors: Record<string, string[]> | null;
    success: boolean;
}

@Injectable()
export class FormStore {
    // Internal state signals
    private _loading = signal(false);
    private _submitting = signal(false);
    private _backendErrors = signal<Record<string, string[]> | null>(null);
    private _success = signal(false);

    // We can also hold a reference to the formGroup if needed, 
    // but usually the store tracks the *status* of the operation.
    // Ideally, the formGroup validity is tracked by the FormGroup itself, 
    // but we can expose it as a signal if we wrap it.

    // Read-only signals
    loading: Signal<boolean> = this._loading.asReadonly();
    submitting: Signal<boolean> = this._submitting.asReadonly();
    backendErrors: Signal<Record<string, string[]> | null> = this._backendErrors.asReadonly();
    success: Signal<boolean> = this._success.asReadonly();

    setLoading(isLoading: boolean) {
        this._loading.set(isLoading);
    }

    setSubmitting(isSubmitting: boolean) {
        this._submitting.set(isSubmitting);
        if (isSubmitting) {
            this._backendErrors.set(null);
            this._success.set(false);
        }
    }

    setBackendErrors(errors: Record<string, string[]>) {
        this._backendErrors.set(errors);
        this._submitting.set(false);
        this._loading.set(false);
    }

    setSuccess() {
        this._success.set(true);
        this._submitting.set(false);
        this._loading.set(false);
        this._backendErrors.set(null);
    }

    reset() {
        this._loading.set(false);
        this._submitting.set(false);
        this._backendErrors.set(null);
        this._success.set(false);
    }
}
