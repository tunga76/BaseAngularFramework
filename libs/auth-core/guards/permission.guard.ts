import { CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const requiredPermission = route.data['permission'] as string;

    if (!requiredPermission) return true;

    return authService.getUserClaims().pipe(
        take(1),
        map(claims => {
            if (!claims) return false;
            const scopes = (claims['scope'] || '').split(' ');
            const permissions = (claims['permissions'] || []);
            // Check if scope or permission matches. 
            // Depending on token structure, adjust accessing properties.
            return scopes.includes(requiredPermission) || permissions.includes(requiredPermission);
        })
    );
};
