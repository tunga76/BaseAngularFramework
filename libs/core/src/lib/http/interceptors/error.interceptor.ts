import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LOGGER_SERVICE } from '../../logging/logger.service';
import { normalizeError } from '../../error/error-normalization';
import { SKIP_ERROR_HANDLING } from '../http-context.tokens';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const logger = inject(LOGGER_SERVICE, { optional: true });
    const skipErrorHandling = req.context.get(SKIP_ERROR_HANDLING);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const normalized = normalizeError(error);

            if (!skipErrorHandling) {
                logger?.error(`HTTP Error: ${normalized.message}`, error);
            }

            return throwError(() => normalized);
        })
    );
};
