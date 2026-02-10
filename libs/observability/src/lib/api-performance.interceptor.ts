import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs';
import { TrackerService } from './tracker.service';
import { OBSERVABILITY_CONFIG } from './tracker.service';

export const apiPerformanceInterceptor: HttpInterceptorFn = (req, next) => {
    const tracker = inject(TrackerService);
    const platformId = inject(PLATFORM_ID);
    const config = inject(OBSERVABILITY_CONFIG);

    // Skip in SSR or if API performance tracking is disabled
    if (!isPlatformBrowser(platformId) || !config.trackApiPerformance) {
        return next(req);
    }

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
