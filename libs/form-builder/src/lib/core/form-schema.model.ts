import { ValidatorSchema } from './validator-schema.model';
import { AsyncValidatorSchema } from './async-validator-schema.model';
import { ConditionalRule } from './conditional-rule.model';

export type FormFieldType = 'text' | 'number' | 'select' | 'date' | 'checkbox';
export type UpdateOnStrategy = 'change' | 'blur' | 'submit';

export interface FormOption {
    label: string;
    value: any;
}

export interface FormFieldSchema {
    name: string;
    type: FormFieldType;
    label: string;
    placeholder?: string;
    defaultValue?: any;
    disabled?: boolean;
    options?: FormOption[];

    validators?: ValidatorSchema[];
    asyncValidators?: AsyncValidatorSchema[];

    visibleWhen?: ConditionalRule[];
    updateOn?: UpdateOnStrategy;

    // UI Metadata
    cssClasses?: string;
    hidden?: boolean;
}

export interface FormSchema {
    fields: FormFieldSchema[];
}
