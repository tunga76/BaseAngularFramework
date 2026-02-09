import { Injectable, signal, computed } from '@angular/core';

export interface AuthState {
    user: string | null;
    permissions: string[];
    roles: string[];
    isAuthenticated: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
    private state = signal<AuthState>({
        user: null,
        permissions: [],
        roles: [],
        isAuthenticated: false,
    });

    // Selectors
    readonly user = computed(() => this.state().user);
    readonly permissions = computed(() => this.state().permissions);
    readonly roles = computed(() => this.state().roles);
    readonly isAuthenticated = computed(() => this.state().isAuthenticated);

    /**
     * Update the auth state
     */
    updateState(newState: Partial<AuthState>) {
        this.state.update((old) => ({ ...old, ...newState }));
    }

    /**
     * Check if user has a specific permission
     */
    hasPermission(permission: string): boolean {
        return this.permissions().includes(permission);
    }

    /**
     * Check if user has any of the specified roles
     */
    hasRole(roles: string[]): boolean {
        return roles.some((role) => this.roles().includes(role));
    }
}
