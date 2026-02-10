import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Using the reactive signal/getter
    if (authService.isAuthenticated()) {
        return true;
    }

    // Redirect to login via service handler
    authService.login();
    return false;
};

export function permissionGuard(requiredPermissions: string | string[]): CanActivateFn {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);
        const userPermissions = authService.getPermissions();

        const permissionsToCheck = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

        const hasPermission = permissionsToCheck.some(permission => userPermissions.includes(permission));

        if (hasPermission) {
            return true;
        }

        router.navigate(['/']);
        return false;
    };
}
