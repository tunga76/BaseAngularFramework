import { APP_INITIALIZER, inject, Provider } from '@angular/core';
import { FormControlRegistry } from '../../core/form-control-registry';
import { MaterialInputComponent } from './material-input.component';
import { MaterialSelectComponent } from './material-select.component';
import { MaterialDatepickerComponent } from './material-datepicker.component';
import { MaterialCheckboxComponent } from './material-checkbox.component';

export function provideMaterialFormAdapters(): Provider[] {
    return [
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: () => {
                const registry = inject(FormControlRegistry);
                return () => {
                    registry.register('text', MaterialInputComponent);
                    registry.register('number', MaterialInputComponent);
                    registry.register('email', MaterialInputComponent);
                    registry.register('select', MaterialSelectComponent);
                    registry.register('date', MaterialDatepickerComponent);
                    registry.register('checkbox', MaterialCheckboxComponent);
                };
            }
        }
    ];
}
