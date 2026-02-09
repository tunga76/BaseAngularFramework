import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { APP_PLATFORM_CONFIG } from '../../core/tokens/app-platform-config.token';
import { PlatformConfig } from '../../core/config/platform-config';

export type ThemeMode = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private themeSubject = new BehaviorSubject<ThemeMode>('light');
    theme$ = this.themeSubject.asObservable();

    constructor(
        @Inject(APP_PLATFORM_CONFIG) private config: PlatformConfig,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.init();
    }

    public init(): void {
        const initialTheme = this.config.defaultTheme || 'light';
        this.setTheme(initialTheme);
    }

    setTheme(theme: ThemeMode): void {
        if (isPlatformBrowser(this.platformId)) {
            document.documentElement.setAttribute('data-theme', theme);
            this.themeSubject.next(theme);
        }
    }

    toggleTheme(): void {
        const current = this.themeSubject.value;
        this.setTheme(current === 'light' ? 'dark' : 'light');
    }

    get currentTheme(): ThemeMode {
        return this.themeSubject.value;
    }
}
