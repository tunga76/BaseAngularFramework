import { InjectionToken } from '@angular/core';
import { MenuItem } from './menu-item';

/**
 * Interface for menu authorization strategy.
 * Implement this interface to provide custom logic for checking if a user can access a menu item.
 */
export interface MenuAuthStrategy {
    canAccess(item: MenuItem): boolean;
    hasPermission(permission: string): boolean;
    hasRole(role: string): boolean;
}

export const MENU_AUTH_STRATEGY = new InjectionToken<MenuAuthStrategy>('MENU_AUTH_STRATEGY');
