import { FormGroup } from '@angular/forms';
import { FormFieldSchema } from './form-schema.model';

export interface DynamicField {
    group: FormGroup;
    config: FormFieldSchema;
}
