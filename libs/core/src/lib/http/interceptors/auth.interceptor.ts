import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, catchError, throwError } from 'rxjs';
import { AUTH_SERVICE } from '../../auth/auth.interface';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Inject the AUTH_SERVICE token. If not provided, this will throw an error at runtime unless marked optional,
    // but auth interceptor suggests auth is mandatory/configured if used.
    const authService = inject(AUTH_SERVICE);

    // If the auth service says we shouldn't intercept this request (e.g., auth endpoints), skip it.
    if (authService.shouldIntercept && !authService.shouldIntercept(req.url)) {
        return next(req);
    }

    return authService.getAccessToken().pipe(
        switchMap(token => {
            let authReq = req;
            if (token) {
                authReq = req.clone({
                    setHeaders: { Authorization: `Bearer ${token}` }
                });
            }

            return next(authReq).pipe(
                catchError((error: HttpErrorResponse) => {
                    // Check if error is 401 Unauthorized
                    if (error.status === 401) {
                        // Attempt to refresh the token
                        return authService.refresh().pipe(
                            switchMap((newToken: string) => {
                                // If refresh successful, retry the original request with the new token
                                const retryReq = req.clone({
                                    setHeaders: { Authorization: `Bearer ${newToken}` }
                                });
                                return next(retryReq);
                            }),
                            catchError((refreshError) => {
                                // If refresh fails, logout user and throw error
                                authService.logout();
                                return throwError(() => refreshError);
                            })
                        );
                    }

                    // If not 401, just pass the error along (to be handled by ErrorInterceptor)
                    return throwError(() => error);
                })
            );
        })
    );
};
