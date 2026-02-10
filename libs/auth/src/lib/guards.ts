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

export function permissionGuard(requiredPermissions: string | string[]): CanActivateFn {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);
        const userPermissions = authService.getPermissions();

        const permissionsToCheck = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

        // Kullanıcının yetkilerinden EN AZ BİRİ istenen yetkiler arasında var mı?
        const hasPermission = permissionsToCheck.some(permission => userPermissions.includes(permission));

        if (hasPermission) {
            return true;
        }

        router.navigate(['/']);
        return false;
    };
}
