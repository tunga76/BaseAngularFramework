export type ConditionalOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'contains';

export interface ConditionalRule {
    dependsOn: string;
    value?: any;
    operator?: ConditionalOperator;
}
