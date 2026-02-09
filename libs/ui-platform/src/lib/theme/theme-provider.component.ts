import { Component, Input, OnInit, Renderer2, Inject, effect, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface ThemeConfig {
    primaryColor?: string;
    borderRadius?: string;
    fontScale?: string;
    mode: 'light' | 'dark';
}

@Component({
    selector: 'platform-theme-provider',
    template: `<ng-content></ng-content>`,
    standalone: true
})
export class ThemeProviderComponent implements OnInit {
    @Input() set config(value: ThemeConfig) {
        this._config.set(value);
    }

    private _config = signal<ThemeConfig>({ mode: 'light' });

    constructor(
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document
    ) {
        effect(() => {
            const config = this._config();
            this.applyTheme(config);
        });
    }

    ngOnInit() { }

    private applyTheme(config: ThemeConfig) {
        const root = this.document.documentElement;

        this.renderer.setAttribute(root, 'data-theme', config.mode);

        if (config.primaryColor) {
            this.renderer.setStyle(root, '--color-primary', config.primaryColor);
        }
        if (config.borderRadius) {
            this.renderer.setStyle(root, '--radius-md', config.borderRadius);
        }
        if (config.fontScale) {
            this.renderer.setStyle(root, '--font-scale-base', config.fontScale);
        }
    }
}
