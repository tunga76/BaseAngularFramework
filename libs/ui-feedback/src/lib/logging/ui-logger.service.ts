import { Injectable, Optional, Inject, InjectionToken } from '@angular/core';

/**
 * External logger interface for integration with application-level logging.
 */
export interface ExternalLogger {
    error(message: string, error?: any, metadata?: any): void;
    warn(message: string, metadata?: any): void;
    info(message: string, metadata?: any): void;
    debug(message: string, metadata?: any): void;
}

export const EXTERNAL_LOGGER = new InjectionToken<ExternalLogger>('EXTERNAL_LOGGER');

/**
 * Centralized logging service for UI Feedback library.
 * 
 * Provides structured logging with context and optional integration
 * with external logging services.
 */
@Injectable({
    providedIn: 'root'
})
export class UiLoggerService {
    private readonly prefix = '[UiFeedback]';

    constructor(
        @Optional() @Inject(EXTERNAL_LOGGER) private externalLogger?: ExternalLogger
    ) { }

    /**
     * Logs an error with context and metadata.
     * 
     * @param context - Component or service name where error occurred
     * @param error - Error object or message
     * @param metadata - Additional structured data
     */
    logError(context: string, error: any, metadata?: any): void {
        const message = `${this.prefix} ${context}`;

        if (this.externalLogger) {
            this.externalLogger.error(message, error, metadata);
        } else {
            console.error(message, error, metadata);
        }
    }

    /**
     * Logs a warning message.
     * 
     * @param context - Component or service name
     * @param message - Warning message
     * @param metadata - Additional structured data
     */
    logWarning(context: string, message: string, metadata?: any): void {
        const fullMessage = `${this.prefix} ${context}: ${message}`;

        if (this.externalLogger) {
            this.externalLogger.warn(fullMessage, metadata);
        } else {
            console.warn(fullMessage, metadata);
        }
    }

    /**
     * Logs an informational message.
     * 
     * @param context - Component or service name
     * @param message - Info message
     * @param metadata - Additional structured data
     */
    logInfo(context: string, message: string, metadata?: any): void {
        const fullMessage = `${this.prefix} ${context}: ${message}`;

        if (this.externalLogger) {
            this.externalLogger.info(fullMessage, metadata);
        } else {
            console.info(fullMessage, metadata);
        }
    }

    /**
     * Logs a debug message (only in development).
     * 
     * @param context - Component or service name
     * @param message - Debug message
     * @param metadata - Additional structured data
     */
    logDebug(context: string, message: string, metadata?: any): void {
        const fullMessage = `${this.prefix} ${context}: ${message}`;

        if (this.externalLogger) {
            this.externalLogger.debug(fullMessage, metadata);
        } else {
            // Only log in development
            if (typeof ngDevMode !== 'undefined' && ngDevMode) {
                console.debug(fullMessage, metadata);
            }
        }
    }
}
