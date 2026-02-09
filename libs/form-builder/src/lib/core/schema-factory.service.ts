import { Injectable } from '@angular/core';
import { BuilderField, BuilderFormSchema } from '../models';

export interface FormEngineSchema {
    id: string;
    name: string;
    elements: any[];
}

@Injectable({
    providedIn: 'root'
})
export class SchemaFactoryService {

    createField(type: string): BuilderField {
        const id = crypto.randomUUID();
        const baseField: BuilderField = {
            id,
            name: `${type}_${Math.random().toString(36).substring(2, 7)}`,
            label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            type: type as any,
            validators: [],
            ui: {
                colSpan: { xs: 12, md: 12, lg: 12 }
            }
        };

        if (type === 'select') {
            baseField.options = [
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2' }
            ];
        }

        return baseField;
    }

    toFormEngineSchema(builderSchema: BuilderFormSchema): FormEngineSchema {
        return {
            id: builderSchema.id,
            name: builderSchema.title,
            elements: builderSchema.fields.map(f => this.mapFieldToEngine(f))
        };
    }

    fromFormEngineSchema(json: any): BuilderFormSchema {
        // If it's already a builder internal schema (has 'fields' array)
        if (json.fields && Array.isArray(json.fields)) {
            return {
                id: json.id || crypto.randomUUID(),
                title: json.title || json.name || 'Imported Form',
                fields: json.fields
            };
        }

        // Otherwise treat as form engine schema (traditional format with 'elements')
        return {
            id: json.id || crypto.randomUUID(),
            title: json.name || json.title || 'Imported Form',
            fields: (json.elements || []).map((el: any) => this.mapEngineToField(el))
        };
    }

    private mapFieldToEngine(field: BuilderField): any {
        const engineField: any = {
            key: field.name,
            type: field.type,
            templateOptions: {
                label: field.label,
                placeholder: field.ui.placeholder,
                description: field.ui.hint,
                options: field.options,
                required: field.validators.some(v => v.type === 'required'),
            },
            className: `col-xs-${field.ui.colSpan?.xs || 12} col-md-${field.ui.colSpan?.md || 12} col-lg-${field.ui.colSpan?.lg || 12}`,
            defaultValue: field.defaultValue,
            validators: field.validators // Pass the full config array to engine
        };

        if (field.children && field.children.length > 0) {
            engineField.fieldGroup = field.children.map(c => this.mapFieldToEngine(c));
        }

        return engineField;
    }

    private mapEngineToField(el: any): BuilderField {
        const field: BuilderField = {
            id: crypto.randomUUID(),
            name: el.key,
            label: el.templateOptions?.label || el.key,
            type: el.type,
            defaultValue: el.defaultValue,
            options: el.templateOptions?.options,
            validators: [],
            ui: {
                placeholder: el.templateOptions?.placeholder,
                hint: el.templateOptions?.description,
                colSpan: this.parseClassName(el.className)
            }
        };

        if (el.templateOptions?.required) {
            field.validators.push({ type: 'required' });
        }

        if (el.validators?.validation) {
            el.validators.validation.forEach((v: string) => {
                if (v !== 'required') {
                    field.validators.push({ type: v });
                }
            });
        }

        if (el.fieldGroup) {
            field.children = el.fieldGroup.map((c: any) => this.mapEngineToField(c));
        }

        return field;
    }

    private parseClassName(className: string): any {
        const colSpan = { xs: 12, md: 12, lg: 12 };
        if (!className) return colSpan;

        const parts = className.split(' ');
        parts.forEach(p => {
            if (p.startsWith('col-xs-')) colSpan.xs = parseInt(p.replace('col-xs-', ''));
            if (p.startsWith('col-md-')) colSpan.md = parseInt(p.replace('col-md-', ''));
            if (p.startsWith('col-lg-')) colSpan.lg = parseInt(p.replace('col-lg-', ''));
            // handle col-12 style too
            if (p === 'col-12') {
                colSpan.xs = 12; colSpan.md = 12; colSpan.lg = 12;
            }
        });

        return colSpan;
    }
}
