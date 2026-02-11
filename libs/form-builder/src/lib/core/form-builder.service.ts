import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FormFieldSchema, FormSchema } from './form-schema.model';
import { ValidatorSchema } from './validator-schema.model';
import { AsyncValidatorSchema } from './async-validator-schema.model';

@Injectable({ providedIn: 'root' })
export class FormBuilderService {
    private fb = inject(FormBuilder);

    // This could be injected or just a map
    private customValidators: Record<string, (args?: any) => ValidatorFn> = {};

    registerValidator(name: string, validatorFactory: (args?: any) => ValidatorFn) {
        this.customValidators[name] = validatorFactory;
    }

    buildForm(schema: FormSchema): FormGroup {
        const group: Record<string, FormControl> = {};

        schema.fields.forEach(field => {
            const validators = this.mapValidators(field.validators);
            // Async validators would be mapped here similarly
            // const asyncValidators = this.mapAsyncValidators(field.asyncValidators);

            group[field.name] = this.fb.control(
                { value: field.defaultValue ?? null, disabled: field.disabled },
                {
                    validators,
                    // asyncValidators,
                    updateOn: field.updateOn || 'change'
                }
            );
        });

        return this.fb.group(group);
    }

    private mapValidators(validators?: ValidatorSchema[]): ValidatorFn[] {
        if (!validators) return [];
        return validators.map(v => {
            if (this.customValidators[v.name]) {
                return this.customValidators[v.name](v.args);
            }
            // Map standard Angular validators
            switch (v.name) {
                case 'required': return Validators.required;
                case 'email': return Validators.email;
                case 'min': return Validators.min(v.args);
                case 'max': return Validators.max(v.args);
                case 'minLength': return Validators.minLength(v.args);
                case 'maxLength': return Validators.maxLength(v.args);
                case 'pattern': return Validators.pattern(v.args);
                default:
                    console.warn(`Validator ${v.name} not found`);
                    return Validators.nullValidator;
            }
        });
    }
}
