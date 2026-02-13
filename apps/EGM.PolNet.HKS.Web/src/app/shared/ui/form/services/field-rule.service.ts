import { Injectable } from '@angular/core';
import {
    FieldRuleContext,
    FieldRuleDefinition,
    FieldRuleResult
} from '../models/field-rule.model';
import { FIELD_RULES } from '../config/field-rule.config';

@Injectable({ providedIn: 'root' })
export class FieldRuleService {

    private rules: FieldRuleDefinition[] = FIELD_RULES;

    evaluate(fieldName: string, context: FieldRuleContext): FieldRuleResult {

        const matchedRules = this.rules.filter(
            r => r.field === fieldName && r.when(context)
        );

        return matchedRules.reduce((acc, rule) => {
            return { ...acc, ...rule.effect };
        }, {} as FieldRuleResult);
    }
}
