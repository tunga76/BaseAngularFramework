export interface FieldRuleResult {
    readonly?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    required?: boolean;
}

export interface FieldRuleContext {
    role?: string;
    status?: string;
    [key: string]: any;
}

export interface FieldRuleDefinition {
    field: string;
    when: (context: FieldRuleContext) => boolean;
    effect: FieldRuleResult;
}
