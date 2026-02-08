import { Injectable, InjectionToken, inject } from '@angular/core';
import { CORE_CONFIG } from '../config/core-config';

export abstract class LoggerService {
    abstract debug(message: string, ...args: any[]): void;
    abstract info(message: string, ...args: any[]): void;
    abstract warn(message: string, ...args: any[]): void;
    abstract error(message: string, ...args: any[]): void;
}

export const LOGGER_SERVICE = new InjectionToken<LoggerService>('PLATFORM_LOGGER_SERVICE');

@Injectable({ providedIn: 'root' })
export class DefaultLoggerService implements LoggerService {
    private config = inject(CORE_CONFIG);

    debug(message: string, ...args: any[]): void {
        if (this.config.logLevel === 'debug') {
            console.log(`[DEBUG] ${message}`, ...args);
        }
    }

    info(message: string, ...args: any[]): void {
        if (['debug', 'info'].includes(this.config.logLevel || 'info')) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }

    warn(message: string, ...args: any[]): void {
        if (['debug', 'info', 'warn'].includes(this.config.logLevel || 'info')) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    error(message: string, ...args: any[]): void {
        console.error(`[ERROR] ${message}`, ...args);
    }
}
