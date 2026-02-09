import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    // Skip authentication for token and authorize endpoints to avoid recursive loops
    if (req.url.includes('/token') || req.url.includes('/authorize')) {
        return next(req);
    }

    return authService.getAccessToken().pipe(
        take(1),
        switchMap(token => {
            if (token) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            return next(req);
        })
    );
};
