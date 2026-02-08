import { Injectable, inject } from '@angular/core';
import { NgxSpinnerService as NgxSpinner } from 'ngx-spinner';
import { SpinnerService, SpinnerOptions } from './ui-interfaces';

@Injectable({
    providedIn: 'root'
})
export class NgxSpinnerImplService implements SpinnerService {
    private spinner = inject(NgxSpinner);

    show(name?: string, options?: SpinnerOptions): void {
        this.spinner.show(name, options);
    }

    hide(name?: string): void {
        this.spinner.hide(name);
    }
}
