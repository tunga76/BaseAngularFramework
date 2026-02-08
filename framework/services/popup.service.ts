import { Inject, Injectable, Optional } from '@angular/core';
import { POPUP_ADAPTER } from '../core/tokens';
import { PopupAdapter } from '../ui/adapters/popup.adapter';

@Injectable({
    providedIn: 'root'
})
export class PopupService {

    constructor(
        @Optional() @Inject(POPUP_ADAPTER) private adapter: PopupAdapter
    ) { }

    showError(message: string, title: string = 'Error'): void {
        if (this.adapter) {
            this.adapter.showError(message, title);
        } else {
            console.error(`[PopupService] ${title}: ${message}`);
        }
    }

    showSuccess(message: string, title?: string): void {
        this.adapter?.showSuccess(message, title);
    }

    showInfo(message: string, title?: string): void {
        this.adapter?.showInfo(message, title);
    }

    showWarning(message: string, title?: string): void {
        this.adapter?.showWarning(message, title);
    }
}
