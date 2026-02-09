import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    // Optionally store current URL and redirect to login
    authService.login();
    return false;
};

export function permissionGuard(requiredPermission: string): CanActivateFn {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);
        const permissions = authService.getPermissions();

        if (permissions.includes(requiredPermission)) {
            return true;
        }

        router.navigate(['/']);
        return false;
    };
}
