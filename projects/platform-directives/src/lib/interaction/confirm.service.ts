import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
    /**
     * Show a confirmation dialog. 
     * This is an abstraction that can be implemented with Material/PrimeNG etc.
     * For now, it uses the native window.confirm.
     */
    async confirm(message: string): Promise<boolean> {
        // In a real implementation, this would open a modal and return a Promise
        return window.confirm(message);
    }
}
