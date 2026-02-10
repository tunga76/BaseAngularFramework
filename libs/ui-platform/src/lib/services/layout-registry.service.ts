import { Injectable, Type, signal, computed } from '@angular/core';

/**
 * Entry describing a registered layout component.
 * 
 * @template T - The component type
 */
export interface LayoutEntry<T = any> {
    /** Unique identifier for the layout */
    name: string;
    /** Angular component class to render */
    component: Type<T>;
}

/**
 * Service for managing application layouts dynamically.
 * 
 * Provides a centralized registry for layout components with reactive state management
 * using Angular signals. Layouts can be registered at runtime and switched dynamically.
 * 
 * @example
 * ```typescript
 * // Register layouts
 * layoutRegistry.registerLayout('dashboard', DashboardLayoutComponent);
 * layoutRegistry.registerLayout('fullscreen', FullScreenLayoutComponent);
 * 
 * // Switch active layout
 * layoutRegistry.setActiveLayout('dashboard');
 * 
 * // Get active layout (reactive)
 * const layout = layoutRegistry.activeLayout();
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class LayoutRegistryService {
    private layouts = signal<Map<string, Type<any>>>(new Map());
    private activeLayoutName = signal<string>('dashboard');

    /**
     * Computed property that returns the active layout component.
     * Automatically updates when activeLayoutName changes.
     */
    public readonly activeLayout = computed(() => {
        const name = this.activeLayoutName();
        return this.layouts().get(name);
    });

    /**
     * Registers a layout component with a unique name.
     * 
     * @template T - The component type
     * @param name - Unique identifier for the layout (lowercase letters, numbers, hyphens only)
     * @param component - Angular component class to use as layout
     * @throws {Error} If name is empty or contains invalid characters
     * @throws {Error} If a layout with the same name is already registered
     * 
     * @example
     * ```typescript
     * layoutRegistry.registerLayout('dashboard', DashboardLayoutComponent);
     * layoutRegistry.registerLayout('split-view', SplitViewLayoutComponent);
     * ```
     */
    registerLayout<T>(name: string, component: Type<T>): void {
        // Validate name
        if (!name?.trim()) {
            throw new Error('Layout name cannot be empty');
        }

        if (!/^[a-z0-9-]+$/.test(name)) {
            throw new Error(
                `Layout name "${name}" is invalid. Use only lowercase letters, numbers, and hyphens.`
            );
        }

        // Check for duplicates
        if (this.layouts().has(name)) {
            throw new Error(
                `Layout "${name}" is already registered. Use a different name or unregister the existing layout first.`
            );
        }

        // Register the layout
        this.layouts.update(map => {
            const newMap = new Map(map);
            newMap.set(name, component);
            return newMap;
        });
    }

    /**
     * Sets the active layout by name.
     * 
     * @param name - Name of the layout to activate
     * @throws {Error} If the layout is not registered
     * 
     * @example
     * ```typescript
     * layoutRegistry.setActiveLayout('dashboard');
     * ```
     */
    setActiveLayout(name: string): void {
        if (!this.layouts().has(name)) {
            const registeredLayouts = Array.from(this.layouts().keys()).join(', ');
            throw new Error(
                `Layout "${name}" is not registered. Available layouts: ${registeredLayouts || 'none'}`
            );
        }

        this.activeLayoutName.set(name);
    }

    /**
     * Returns the name of the currently active layout.
     * 
     * @returns The active layout name
     * 
     * @example
     * ```typescript
     * const currentLayout = layoutRegistry.getActiveLayout();
     * console.log(`Active layout: ${currentLayout}`);
     * ```
     */
    getActiveLayout(): string {
        return this.activeLayoutName();
    }

    /**
     * Checks if a layout with the given name is registered.
     * 
     * @param name - Layout name to check
     * @returns True if the layout exists, false otherwise
     * 
     * @example
     * ```typescript
     * if (layoutRegistry.hasLayout('dashboard')) {
     *   layoutRegistry.setActiveLayout('dashboard');
     * }
     * ```
     */
    hasLayout(name: string): boolean {
        return this.layouts().has(name);
    }

    /**
     * Returns all registered layout names.
     * 
     * @returns Array of layout names
     * 
     * @example
     * ```typescript
     * const layouts = layoutRegistry.getRegisteredLayouts();
     * console.log('Available layouts:', layouts);
     * ```
     */
    getRegisteredLayouts(): string[] {
        return Array.from(this.layouts().keys());
    }

    /**
     * Unregisters a layout by name.
     * 
     * @param name - Name of the layout to remove
     * @throws {Error} If trying to unregister the currently active layout
     * 
     * @example
     * ```typescript
     * layoutRegistry.unregisterLayout('old-layout');
     * ```
     */
    unregisterLayout(name: string): void {
        if (this.activeLayoutName() === name) {
            throw new Error(
                `Cannot unregister layout "${name}" because it is currently active. Switch to a different layout first.`
            );
        }

        this.layouts.update(map => {
            const newMap = new Map(map);
            newMap.delete(name);
            return newMap;
        });
    }
}
