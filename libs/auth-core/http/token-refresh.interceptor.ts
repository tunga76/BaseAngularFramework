import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { LogoutService } from '../services/logout.service';

// Use a simplified approach for functional interceptor state
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const tokenRefreshInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const tokenService = inject(TokenService);
    const logoutService = inject(LogoutService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Ignore 401 on the token endpoint to prevent loops
                if (req.url.includes('/token')) {
                    return throwError(() => error);
                }

                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshTokenSubject.next(null);

                    return tokenService.refreshTokens().pipe(
                        switchMap((tokenResponse) => {
                            isRefreshing = false;
                            if (tokenResponse) {
                                refreshTokenSubject.next(tokenResponse.access_token);
                                const newReq = req.clone({
                                    setHeaders: { Authorization: `Bearer ${tokenResponse.access_token}` }
                                });
                                return next(newReq);
                            }
                            // Refresh failed
                            logoutService.logout();
                            return throwError(() => new Error('Session Expired'));
                        }),
                        catchError((err) => {
                            isRefreshing = false;
                            logoutService.logout();
                            return throwError(() => err);
                        })
                    );
                } else {
                    return refreshTokenSubject.pipe(
                        filter(token => token !== null),
                        take(1),
                        switchMap((token) => {
                            const newReq = req.clone({
                                setHeaders: { Authorization: `Bearer ${token}` }
                            });
                            return next(newReq);
                        })
                    );
                }
            }
            return throwError(() => error);
        })
    );
};
