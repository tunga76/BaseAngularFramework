import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FeatureStore {
    private featureFlags = signal<Record<string, boolean>>({});

    // Selectors
    readonly flags = computed(() => this.featureFlags());

    /**
     * Set multiple feature flags
     */
    setFlags(flags: Record<string, boolean>) {
        this.featureFlags.set(flags);
    }

    /**
     * Update a specific feature flag
     */
    updateFlag(key: string, enabled: boolean) {
        this.featureFlags.update((flags) => ({ ...flags, [key]: enabled }));
    }

    /**
     * Check if a feature is enabled
     */
    isEnabled(key: string): boolean {
        return !!this.featureFlags()[key];
    }
}
