export type FieldType = 'text' | 'password' | 'select' | 'date' | 'checkbox' | 'divider' | 'section';

export interface ValidatorConfig {
    type: string;
    value?: any;
    message?: string;
}

export interface SelectOption {
    label: string;
    value: any;
}

export interface FieldUIConfig {
    placeholder?: string;
    hint?: string;
    colSpan?: {
        xs: number;
        md: number;
        lg: number;
    };
    customClass?: string;
}

export interface BuilderField {
    id: string;
    name: string;
    label: string;
    type: FieldType;
    defaultValue?: any;
    validators: ValidatorConfig[];
    options?: SelectOption[];
    ui: FieldUIConfig;
    children?: BuilderField[]; // For section/nested layout
}
