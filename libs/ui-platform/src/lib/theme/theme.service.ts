import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly THEME_KEY = 'app-theme';

    // Signal to hold the current theme
    readonly currentTheme = signal<Theme>('light');

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            this.initializeTheme();
        }

        // Effect to apply theme whenever it changes
        effect(() => {
            const theme = this.currentTheme();
            if (isPlatformBrowser(this.platformId)) {
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem(this.THEME_KEY, theme);
            }
        });
    }

    private initializeTheme(): void {
        const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
        if (savedTheme) {
            this.currentTheme.set(savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.currentTheme.set('dark');
        }
    }

    setTheme(theme: Theme): void {
        this.currentTheme.set(theme);
    }

    toggleTheme(): void {
        this.currentTheme.update(current => current === 'light' ? 'dark' : 'light');
    }
}
