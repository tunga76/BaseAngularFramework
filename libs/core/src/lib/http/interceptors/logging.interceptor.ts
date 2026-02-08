import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LOGGER_SERVICE } from '../../logging/logger.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const logger = inject(LOGGER_SERVICE, { optional: true });
    const started = Date.now();

    return next(req).pipe(
        tap({
            next: (event) => {
                if (event instanceof HttpResponse) {
                    const elapsed = Date.now() - started;
                    logger?.debug(`HTTP Request: ${req.method} ${req.urlWithParams} took ${elapsed}ms`);
                }
            },
            error: (error) => {
                const elapsed = Date.now() - started;
                logger?.error(`HTTP Request Failed: ${req.method} ${req.urlWithParams} after ${elapsed}ms`, error);
            }
        })
    );
};
