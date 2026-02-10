import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LOGGER_SERVICE } from '../../logging/logger.service';
import { SKIP_ERROR_HANDLING, SKIP_UI_FEEDBACK } from '../http-context.tokens';
import { normalizeError } from '../../error/error-normalization';
import { NOTIFICATION_SERVICE } from '../../notifications/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const logger = inject(LOGGER_SERVICE, { optional: true });
    // Core doesn't implement the UI (Toast/Snackbar), but it defines the contract.
    // The main app or framework layer should provide the implementation.
    const notificationService = inject(NOTIFICATION_SERVICE, { optional: true });

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // 1. Check if error handling should be skipped for this specific request
            if (req.context.get(SKIP_ERROR_HANDLING)) {
                return throwError(() => error);
            }

            // 2. Normalize the error using our central utility
            const normalized = normalizeError(error);

            // 3. Log the error (with context 'HTTP')
            logger?.error(`[HTTP] ${normalized.code} (${normalized.status || 'N/A'}): ${normalized.message}`, error);

            // 4. Show User Feedback (if service exists)
            // Skip feedback if explicitly requested via context (e.g. background polling)
            if (!req.context.get(SKIP_UI_FEEDBACK)) {
                notificationService?.showError(normalized.message);
            }

            // Re-throw the error to downstream subscribers
            return throwError(() => error);
        })
    );
};
