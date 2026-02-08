import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpResponse
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { CircuitBreakerService } from '../services/circuit-breaker.service';
import { REQUEST_OPTIONS } from '../core/context-tokens';
import { timeout, retry, tap, catchError } from 'rxjs/operators';

@Injectable()
export class ResilienceInterceptor implements HttpInterceptor {

    constructor(private circuitBreaker: CircuitBreakerService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const options = request.context.get(REQUEST_OPTIONS);
        const resilience = options?.resilience || {};
        // Use a unique key for circuit breaker, e.g. method+url
        const key = `${request.method}:${request.urlWithParams}`;

        if (resilience.circuitBreaker && !this.circuitBreaker.canRequest(key)) {
            return throwError(() => new HttpErrorResponse({ status: 503, statusText: 'Circuit Breaker Open' }));
        }

        let pipeline$ = next.handle(request);

        if (resilience.timeoutMs) {
            pipeline$ = pipeline$.pipe(timeout(resilience.timeoutMs));
        }

        if (resilience.retry) {
            pipeline$ = pipeline$.pipe(
                retry({
                    count: resilience.retry,
                    delay: (error, retryCount) => timer(retryCount * 1000)
                })
            );
        }

        return pipeline$.pipe(
            tap(event => {
                if (event instanceof HttpResponse && resilience.circuitBreaker) {
                    this.circuitBreaker.recordSuccess(key);
                }
            }),
            catchError((error: HttpErrorResponse) => {
                if (resilience.circuitBreaker) {
                    this.circuitBreaker.recordFailure(key);
                }
                return throwError(() => error);
            })
        );
    }
}
