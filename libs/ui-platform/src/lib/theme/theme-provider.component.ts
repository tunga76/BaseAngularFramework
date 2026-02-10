import { Component, Input, OnInit, Renderer2, Inject, effect, signal, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * Configuration interface for theme customization.
 */
export interface ThemeConfig {
    /** Primary color in any valid CSS color format (hex, rgb, hsl) */
    primaryColor?: string;
    /** Border radius value (e.g., '8px', '0.5rem') */
    borderRadius?: string;
    /** Font scale multiplier (e.g., '1', '1.2') */
    fontScale?: string;
    /** Theme mode: light or dark */
    mode: 'light' | 'dark';
}

/**
 * Component that provides global theme configuration for the application.
 * 
 * Applies theme settings to the document root element using CSS custom properties.
 * Safe for Server-Side Rendering (SSR) - theme is only applied in browser.
 * 
 * @example
 * ```typescript
 * // app.component.ts
 * <platform-theme-provider [config]="themeConfig">
 *   <router-outlet></router-outlet>
 * </platform-theme-provider>
 * 
 * // Component
 * themeConfig: ThemeConfig = {
 *   mode: 'dark',
 *   primaryColor: '#3b82f6',
 *   borderRadius: '8px',
 *   fontScale: '1.1'
 * };
 * ```
 */
@Component({
    selector: 'platform-theme-provider',
    template: `<ng-content></ng-content>`,
    standalone: true
})
export class ThemeProviderComponent implements OnInit {
    /**
     * Theme configuration input.
     * Changes are automatically applied using Angular effects.
     */
    @Input() set config(value: ThemeConfig) {
        if (value) {
            this.validateThemeConfig(value);
            this._config.set(value);
        }
    }

    private _config = signal<ThemeConfig>({ mode: 'light' });

    constructor(
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        // Automatically apply theme when config changes
        effect(() => {
            const config = this._config();
            this.applyTheme(config);
        });
    }

    ngOnInit(): void {
        // Initial theme application is handled by the effect
    }

    /**
     * Validates theme configuration.
     * 
     * @param config - Theme configuration to validate
     * @throws {Error} If configuration is invalid
     */
    private validateThemeConfig(config: ThemeConfig): void {
        if (!config.mode || !['light', 'dark'].includes(config.mode)) {
            throw new Error('Theme mode must be either "light" or "dark"');
        }

        // Validate color format (basic validation)
        if (config.primaryColor && !this.isValidColor(config.primaryColor)) {
            console.warn(
                `Invalid primaryColor "${config.primaryColor}". Expected valid CSS color (hex, rgb, hsl).`
            );
        }
    }

    /**
     * Basic color validation (checks common CSS color formats).
     * 
     * @param color - Color string to validate
     * @returns True if color appears valid
     */
    private isValidColor(color: string): boolean {
        // Check for hex, rgb, rgba, hsl, hsla, or named colors
        const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const rgbPattern = /^rgba?\(/;
        const hslPattern = /^hsla?\(/;

        return hexPattern.test(color) ||
            rgbPattern.test(color) ||
            hslPattern.test(color) ||
            CSS.supports('color', color);
    }

    /**
     * Applies theme configuration to the document root element.
     * Only runs in browser environment (SSR-safe).
     * 
     * Sets the following CSS custom properties:
     * - `data-theme` attribute: 'light' or 'dark'
     * - `--color-primary`: Primary color
     * - `--radius-md`: Border radius
     * - `--font-scale-base`: Font scale multiplier
     * 
     * @param config - Theme configuration to apply
     */
    private applyTheme(config: ThemeConfig): void {
        // Skip in SSR environment
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        try {
            const root = this.document.documentElement;

            // Apply theme mode
            this.renderer.setAttribute(root, 'data-theme', config.mode);

            // Apply custom properties if provided
            if (config.primaryColor) {
                this.renderer.setStyle(root, '--color-primary', config.primaryColor);
            }

            if (config.borderRadius) {
                this.renderer.setStyle(root, '--radius-md', config.borderRadius);
            }

            if (config.fontScale) {
                this.renderer.setStyle(root, '--font-scale-base', config.fontScale);
            }
        } catch (error) {
            console.error('Failed to apply theme configuration:', error);
        }
    }

    /**
     * Gets the current theme configuration.
     * 
     * @returns Current theme config
     */
    public getConfig(): ThemeConfig {
        return this._config();
    }

    /**
     * Toggles between light and dark mode.
     * 
     * @example
     * ```typescript
     * @ViewChild(ThemeProviderComponent) themeProvider!: ThemeProviderComponent;
     * 
     * toggleDarkMode() {
     *   this.themeProvider.toggleMode();
     * }
     * ```
     */
    public toggleMode(): void {
        const currentConfig = this._config();
        this._config.set({
            ...currentConfig,
            mode: currentConfig.mode === 'light' ? 'dark' : 'light'
        });
    }
}
