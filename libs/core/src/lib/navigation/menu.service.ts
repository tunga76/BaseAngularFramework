import { Injectable, signal, computed, inject } from '@angular/core';
import { MenuItem } from './menu-item';
import { AuthService } from '@platform/auth';

@Injectable({ providedIn: 'root' })
export class MenuService {
    private authService = inject(AuthService);

    private masterMenu = signal<MenuItem[]>([]);

    // Computed signal that filters the menu based on authentication and permissions
    readonly menuItems = computed(() => {
        const permissions = this.authService.getPermissions();
        const isAuthenticated = this.authService.isAuthenticated();

        return this.filterMenuItems(this.masterMenu(), isAuthenticated, permissions);
    });

    setMenu(menu: MenuItem[]): void {
        this.masterMenu.set(menu);
    }

    private filterMenuItems(items: MenuItem[], isAuthenticated: boolean, userPermissions: string[]): MenuItem[] {
        return items
            .filter(item => {
                if (item.hidden) return false;

                // If item requires a permission, check if user has it
                if (item.permission) {
                    if (!isAuthenticated) return false;
                    return userPermissions.includes(item.permission);
                }

                return true;
            })
            .map(item => ({
                ...item,
                children: item.children ? this.filterMenuItems(item.children, isAuthenticated, userPermissions) : undefined
            }))
            .filter(item => !item.children || item.children.length > 0 || !item.route); // Remove parent if no children or route
    }
}
