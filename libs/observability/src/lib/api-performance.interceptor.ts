import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { TrackerService } from './tracker.service';

export const apiPerformanceInterceptor: HttpInterceptorFn = (req, next) => {
    const tracker = inject(TrackerService);
    const started = Date.now();

    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse) {
                const duration = Date.now() - started;
                tracker.track('api_performance', {
                    url: req.url,
                    method: req.method,
                    duration,
                    status: event.status
                });
            }
        })
    );
};
