// form-store.service.ts

import { Injectable, signal, computed, effect } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormStoreState } from '../state/form-store.state';

@Injectable({ providedIn: 'root' })
export class FormStoreService {

    private stores = signal<Map<string, FormStoreState<any>>>(new Map());

    // --------------------------
    // CREATE
    // --------------------------
    create<T>(id: string, form: FormGroup): void {

        const state: FormStoreState<T> = {
            id,
            form,
            initialValue: form.getRawValue(),
            value: form.getRawValue(),
            dirty: false,
            valid: form.valid,
            pending: form.pending,
            loading: false,
            submitting: false,
            error: null
        };

        this.stores.update(map => {
            map.set(id, state);
            return new Map(map);
        });

        this.bindFormChanges(id);
    }

    // --------------------------
    // BIND FORM EVENTS
    // --------------------------
    private bindFormChanges<T>(id: string) {
        const store = this.getState<T>(id);
        if (!store) return;

        store.form.valueChanges.subscribe(() => {
            this.update(id, {
                value: store.form.getRawValue(),
                dirty: store.form.dirty,
                valid: store.form.valid,
                pending: store.form.pending
            });
        });
    }

    // --------------------------
    // GET STATE
    // --------------------------
    getState<T>(id: string): FormStoreState<T> | undefined {
        return this.stores().get(id);
    }

    select<T>(id: string) {
        return computed(() => this.stores().get(id));
    }

    // --------------------------
    // UPDATE
    // --------------------------
    private update<T>(id: string, partial: Partial<FormStoreState<T>>) {
        this.stores.update(map => {
            const current = map.get(id);
            if (!current) return map;

            map.set(id, { ...current, ...partial });
            return new Map(map);
        });
    }

    // --------------------------
    // PATCH
    // --------------------------
    patch<T>(id: string, value: Partial<T>) {
        const state = this.getState<T>(id);
        if (!state) return;

        state.form.patchValue(value);
    }

    // --------------------------
    // RESET
    // --------------------------
    reset<T>(id: string) {
        const state = this.getState<T>(id);
        if (!state) return;

        state.form.reset(state.initialValue);
    }

    // --------------------------
    // SUBMIT FLOW
    // --------------------------
    async submit<T>(
        id: string,
        saveFn: (value: T) => Promise<any>
    ) {
        const state = this.getState<T>(id);
        if (!state) return;

        if (!state.valid) return;

        this.update(id, { submitting: true, error: null });

        try {
            await saveFn(state.form.getRawValue());
            this.update(id, {
                submitting: false,
                dirty: false,
                initialValue: state.form.getRawValue()
            });
        } catch (err: any) {
            this.update(id, {
                submitting: false,
                error: err?.message ?? 'Save failed'
            });
        }
    }

    // --------------------------
    // DESTROY
    // --------------------------
    destroy(id: string) {
        this.stores.update(map => {
            map.delete(id);
            return new Map(map);
        });
    }
}
