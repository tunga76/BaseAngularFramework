import { Injectable, signal, computed } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeStore {
    private activeTheme = signal<ThemeMode>('light');
    private themeConfig = signal<Record<string, string>>({});

    // Selectors
    readonly mode = computed(() => this.activeTheme());
    readonly isDark = computed(() => this.activeTheme() === 'dark');
    readonly config = computed(() => this.themeConfig());

    /**
     * Set theme mode
     */
    setMode(mode: ThemeMode) {
        this.activeTheme.set(mode);
    }

    /**
     * Toggle between light and dark
     */
    toggleMode() {
        this.activeTheme.update((m) => (m === 'light' ? 'dark' : 'light'));
    }

    /**
     * Update theme color configuration (CSS variables)
     */
    updateConfig(config: Record<string, string>) {
        this.themeConfig.update((old) => ({ ...old, ...config }));
    }
}
