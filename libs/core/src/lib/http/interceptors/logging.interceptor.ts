import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, finalize } from 'rxjs';
import { LOGGER_SERVICE } from '../../logging/logger.service';
import { SKIP_LOGGING } from '../http-context.tokens';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const logger = inject(LOGGER_SERVICE, { optional: true });

    // Check if logging should be skipped for this request (e.g., polling, sensitive data)
    if (req.context.get(SKIP_LOGGING)) {
        return next(req);
    }

    const started = Date.now();
    let ok: string;

    // Helper to generate cURL command for debugging
    const generateCurl = (req: any) => {
        let curl = `curl -X ${req.method} "${req.urlWithParams}"`;
        req.headers.keys().forEach((key: string) => {
            curl += ` -H "${key}: ${req.headers.get(key)}"`;
        });
        if (req.body) {
            try {
                curl += ` -d '${JSON.stringify(req.body)}'`;
            } catch (e) {
                curl += ` -d '[BODY]'`;
            }
        }
        return curl;
    };

    // Log the Request
    // logger?.debug(`[HTTP Request] ${req.method} "${req.urlWithParams}"`);
    // logger?.debug(`[HTTP Headers]`, req.headers);
    // if (req.body) {
    //     logger?.debug(`[HTTP Body]`, req.body);
    // }

    return next(req).pipe(
        tap({
            next: (event) => (ok = event instanceof HttpResponse ? 'succeeded' : ''),
            error: (error) => (ok = 'failed')
        }),
        finalize(() => {
            const elapsed = Date.now() - started;
            const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed}ms.`;

            if (ok === 'succeeded') {
                logger?.info(msg);
            } else if (ok === 'failed') {
                logger?.error(msg);
                // Log curl command for easy replay
                logger?.error(`[Replay] ${generateCurl(req)}`);
            }
        })
    );
};
