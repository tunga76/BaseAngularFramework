import { Injectable, isDevMode } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    log(message: string, context?: string): void {
        console.log(`[LOG]${context ? ' [' + context + ']' : ''}: ${message}`);
    }

    error(message: string, error?: any, context?: string): void {
        console.error(`[ERROR]${context ? ' [' + context + ']' : ''}: ${message}`, error);
    }

    warn(message: string, context?: string): void {
        console.warn(`[WARN]${context ? ' [' + context + ']' : ''}: ${message}`);
    }

    debug(message: string, context?: string): void {
        if (isDevMode()) {
            console.debug(`[DEBUG]${context ? ' [' + context + ']' : ''}: ${message}`);
        }
    }
}
