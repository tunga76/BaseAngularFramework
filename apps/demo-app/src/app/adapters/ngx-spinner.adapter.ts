import { Injectable, inject } from '@angular/core';
import { LoadingAdapter } from '@platform/framework';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class NgxSpinnerAdapter implements LoadingAdapter {
    private spinner = inject(NgxSpinnerService);

    show(key?: string): void {
        this.spinner.show(key);
    }

    hide(key?: string): void {
        this.spinner.hide(key);
    }
}
