import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfirmService, AlertService, ConfirmOptions } from './ui-interfaces';

@Injectable()
export class BrowserConfirmService implements ConfirmService {
    ask(message: string, options?: ConfirmOptions): Observable<boolean> {
        return of(window.confirm(message));
    }
}

@Injectable()
export class BrowserAlertService implements AlertService {
    success(message: string): void {
        alert(`SUCCESS: ${message}`);
    }
    error(message: string): void {
        alert(`ERROR: ${message}`);
    }
    info(message: string): void {
        alert(`INFO: ${message}`);
    }
    warn(message: string): void {
        alert(`WARN: ${message}`);
    }
}
