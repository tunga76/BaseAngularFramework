import { BuilderField } from './builder-field.model';

export interface BuilderFormSchema {
    id: string;
    title: string;
    description?: string;
    fields: BuilderField[];
    version?: string;
    createdAt?: string;
    updatedAt?: string;
}
