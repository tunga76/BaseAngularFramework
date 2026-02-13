import { FieldRuleDefinition } from '../models/field-rule.model';

export const FIELD_RULES: FieldRuleDefinition[] = [

    {
        field: 'Ad',
        when: (ctx) => ctx.role === 'Viewer',
        effect: { readonly: true }
    },

    {
        field: 'Ad',
        when: (ctx) => ctx.status === 'Approved',
        effect: { readonly: true }
    },

    {
        field: 'Ad',
        when: (ctx) => ctx.status === 'Draft',
        effect: { required: true }
    }

];
