import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Example: Get token from a service (not implemented here for brevity)
    const token = localStorage.getItem('access_token');

    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req).pipe(
        catchError((error) => {
            if (error.status === 401) {
                // Handle unauthorized logic (e.g., logout)
            }
            return throwError(() => error);
        })
    );
};
