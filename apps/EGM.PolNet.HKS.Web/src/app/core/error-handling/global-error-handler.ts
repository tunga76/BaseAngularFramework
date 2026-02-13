import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { LoggerService } from '../logging/logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private zone = inject(NgZone);
    private logger = inject(LoggerService);

    handleError(error: any): void {
        // Logic for global error handling (logging to server, showing notification)
        this.zone.run(() => {
            this.logger.error('Unhandled Global Error', error, 'GlobalErrorHandler');
        });
    }
}
