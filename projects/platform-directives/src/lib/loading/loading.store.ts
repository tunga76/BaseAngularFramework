import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingStore {
    private activeLoadingKeys = signal<Set<string>>(new Set());

    // Selectors
    readonly activeKeys = computed(() => Array.from(this.activeLoadingKeys()));
    readonly isLoading = computed(() => this.activeLoadingKeys().size > 0);

    /**
     * Start loading for a specific key
     */
    startLoading(key: string) {
        this.activeLoadingKeys.update((keys) => {
            const next = new Set(keys);
            next.add(key);
            return next;
        });
    }

    /**
     * Stop loading for a specific key
     */
    stopLoading(key: string) {
        this.activeLoadingKeys.update((keys) => {
            const next = new Set(keys);
            next.delete(key);
            return next;
        });
    }

    /**
     * Check if a specific key is loading
     */
    isKeyLoading(key: string): boolean {
        return this.activeLoadingKeys().has(key);
    }
}
