import { Injectable, InjectionToken, inject } from '@angular/core';
import { CORE_CONFIG } from '../config/core-config';

export abstract class LoggerService {
    abstract debug(message: string, context?: string, ...args: any[]): void;
    abstract info(message: string, context?: string, ...args: any[]): void;
    abstract warn(message: string, context?: string, ...args: any[]): void;
    abstract error(message: string, error?: any, context?: string): void;
}

export const LOGGER_SERVICE = new InjectionToken<LoggerService>('PLATFORM_LOGGER_SERVICE');

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

@Injectable({ providedIn: 'root' })
export class DefaultLoggerService implements LoggerService {
    private config = inject(CORE_CONFIG);

    // Color configuration for browser console (Dark/Light mode safe)
    private readonly styles = {
        debug: 'color: #9E9E9E; font-weight: normal;',  // Grey
        info: 'color: #2196F3; font-weight: bold;',      // Blue
        warn: 'color: #FF9800; font-weight: bold;',      // Orange
        error: 'color: #F44336; font-weight: bold;',     // Red
        context: 'color: #607D8B; font-weight: bold;'    // Blue Grey
    };

    debug(message: string, context?: string | any, ...args: any[]): void {
        this.log('debug', message, context, ...args);
    }

    info(message: string, context?: string | any, ...args: any[]): void {
        this.log('info', message, context, ...args);
    }

    warn(message: string, context?: string | any, ...args: any[]): void {
        this.log('warn', message, context, ...args);
    }

    error(message: string, error?: any, context?: string): void {
        if (!this.shouldLog('error')) return;

        const timestamp = new Date().toLocaleTimeString();
        const ctx = context ? ` [${context}]` : '';

        console.groupCollapsed(`%c[ERROR] ${timestamp}${ctx} ${message}`, this.styles.error);
        if (error) {
            console.error(error);
            if (error.stack) {
                console.debug(error.stack);
            }
        }
        console.groupEnd();
    }

    private log(level: LogLevel, message: string, context?: string | any, ...args: any[]): void {
        if (!this.shouldLog(level)) return;

        // Handle if context is actually an object (params shift)
        let ctx = context;
        let finalArgs = args;

        if (typeof context !== 'string' && context !== undefined) {
            finalArgs = [context, ...args];
            ctx = undefined;
        }

        const timestamp = new Date().toLocaleTimeString();
        const contextStr = ctx ? ` [${ctx}]` : '';
        const prefix = `[${level.toUpperCase()}]`;

        const style = this.styles[level];

        // Advanced Browser Logging with Colors
        console.groupCollapsed(`%c${prefix} ${timestamp}${contextStr} ${message}`, style);
        if (finalArgs.length > 0) {
            finalArgs.forEach(arg => {
                if (typeof arg === 'object') {
                    console.log(arg); // Interactive object
                } else {
                    console.log(`%c${arg}`, 'color: #757575');
                }
            });
        }
        console.groupEnd();
    }

    private shouldLog(level: LogLevel): boolean {
        const configuredLevel = this.config.logLevel || 'info';
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];

        return levels.indexOf(level) >= levels.indexOf(configuredLevel);
    }
}
