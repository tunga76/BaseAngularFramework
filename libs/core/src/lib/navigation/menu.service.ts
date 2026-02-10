import { Injectable, signal, inject, Optional } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuItem } from './menu-item';
import { MENU_AUTH_STRATEGY, MenuAuthStrategy } from './menu-auth.token';

@Injectable({ providedIn: 'root' })
export class MenuService {
    private router = inject(Router);
    private authStrategy = inject(MENU_AUTH_STRATEGY, { optional: true });

    // The raw menu config provided to the service
    private _rawItems: MenuItem[] = [];

    // The current active menu structure (filtered & state managed)
    readonly menuItems = signal<MenuItem[]>([]);

    constructor() {
        this.listenToRouteChanges();
    }

    /**
     * Set the master menu configuration and process it.
     */
    setMenu(menu: MenuItem[]) {
        this._rawItems = menu;
        this.refreshMenu();
    }

    /**
     * Re-evaluates permissions and rebuilds the menu tree.
     * Call this when user permissions/roles change.
     */
    refreshMenu() {
        const filtered = this.filterMenuItems(this._rawItems);
        this.menuItems.set(filtered);
        // Re-apply active state after refresh
        this.updateActiveState(this.router.url);
    }

    /**
     * Toggles the expanded state of a menu item (for accordions).
     */
    toggleItem(item: MenuItem) {
        if (!item.children || item.children.length === 0) return;

        item.expanded = !item.expanded;
        // Trigger signal update to refresh UI
        this.menuItems.update(items => [...items]);
    }

    /**
     * Updates badge count for a specific menu item
     */
    updateBadge(id: string, value: string | number) {
        this.updateItemRecursive(this._rawItems, id, (item) => {
            item.badge = value;
        });
        this.refreshMenu(); // Refresh to propagate changes to visible menu
    }

    // --- Private Helpers ---

    private listenToRouteChanges() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.updateActiveState(event.urlAfterRedirects || event.url);
        });
    }

    private updateActiveState(url: string) {
        // Reset all first (optional, or just handle in recursive)
        // Helper to check if an item's route matches the URL
        const isActive = (item: MenuItem): boolean => {
            // Simple exact match or subset match logic
            // For exact: return item.route === url;
            // For subset: return url.startsWith(item.route);
            // Let's use a robust check: if route is present and url includes it
            if (!item.route) return false;
            if (item.route === '/' && url !== '/') return false;
            return url.startsWith(item.route);
        };

        const traverse = (items: MenuItem[]): boolean => {
            let hasActiveChild = false;

            for (const item of items) {
                // Check direct match
                const match = isActive(item);

                // Check children
                const childMatch = item.children ? traverse(item.children) : false;

                item.active = match || childMatch;

                if (childMatch) {
                    item.expanded = true; // Auto-expand parent
                    hasActiveChild = true;
                }
            }
            return hasActiveChild;
        };

        // We act on the *current signal value* to preserve object references if possible, 
        // or we can traverse _rawItems and re-filter. 
        // Traversing existing menuItems signal is better for UI stability.
        const currentItems = this.menuItems();
        traverse(currentItems);
        this.menuItems.set([...currentItems]); // Trigger update
    }

    private filterMenuItems(items: MenuItem[]): MenuItem[] {
        return items
            .filter(item => this.canAccess(item))
            .map(item => {
                // Clone item to avoid mutating original config permanently during runtime
                const newItem = { ...item };
                if (newItem.children) {
                    newItem.children = this.filterMenuItems(newItem.children);
                }
                return newItem;
            })
            .filter(item => {
                // Filter out items that have no children anymore (if they are group headers/parents)
                // Logic: A parent with no valid children and no route should be hidden?
                // The original code did: !item.children || item.children.length > 0 || !item.route
                if (item.children && item.children.length === 0 && !item.route) {
                    return false;
                }
                return true;
            });
    }

    private canAccess(item: MenuItem): boolean {
        if (item.hidden) return false;

        // If strategy is present, delegate
        if (this.authStrategy) {
            return this.authStrategy.canAccess(item);
        }

        // Fallback or default behavior (if no strategy provided)
        // If item has permission/rol field but no strategy, what to do?
        // Safe default: if permissions defined but no strategy, deny? 
        // Or allow everything if 'Agnostic'? 
        // User asked to remove AuthService dependency.
        // If they don't provide a strategy, we presume no auth checks needed or they are handled elsewhere.
        return true;
    }

    private updateItemRecursive(items: MenuItem[], id: string, fn: (item: MenuItem) => void) {
        for (const item of items) {
            if (item.id === id) {
                fn(item);
                return;
            }
            if (item.children) {
                this.updateItemRecursive(item.children, id, fn);
            }
        }
    }
}
