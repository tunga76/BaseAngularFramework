import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';
import { AUTH_CONFIG } from './auth-config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const config = inject(AUTH_CONFIG);

    // Skip authentication for token and authorize endpoints of the issuer specifically
    // to avoid matching other business APIs that might contain these substrings.
    const isAuthRequest = req.url.startsWith(config.issuer) &&
        (req.url.includes('/token') || req.url.includes('/authorize'));

    if (isAuthRequest) {
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
