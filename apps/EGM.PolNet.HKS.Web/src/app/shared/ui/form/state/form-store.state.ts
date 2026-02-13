import { FormGroup } from '@angular/forms';

export interface FormStoreState<T> {
    id: string;
    form: FormGroup;
    initialValue: T;
    value: T;
    dirty: boolean;
    valid: boolean;
    pending: boolean;
    loading: boolean;
    submitting: boolean;
    error: string | null;
}
