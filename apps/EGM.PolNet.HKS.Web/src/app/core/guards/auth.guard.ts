import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    // Example logic
    const isAuthenticated = !!localStorage.getItem('access_token');

    if (isAuthenticated) {
        return true;
    }

    return router.parseUrl('/auth/login');
};
