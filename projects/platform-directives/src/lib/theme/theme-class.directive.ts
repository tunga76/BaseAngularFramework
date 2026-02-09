import { Directive, Input, ElementRef, Renderer2, inject, effect, signal } from '@angular/core';
import { ThemeStore } from './theme.store';

/**
 * Directive to apply theme-specific CSS classes or variables based on ThemeStore.
 * Usage: <div appThemeClass="card"></div>
 */
@Directive({
    selector: '[appThemeClass]',
    standalone: true,
})
export class ThemeClassDirective {
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);
    private themeStore = inject(ThemeStore);

    private baseClass = signal<string | null>(null);

    @Input('appThemeClass') set appThemeClass(val: string) {
        this.baseClass.set(val);
    }

    constructor() {
        effect(() => {
            const mode = this.themeStore.mode();
            const base = this.baseClass();

            if (base) {
                // Remove previous theme-related classes if necessary
                this.renderer.removeClass(this.el.nativeElement, `${base}-light`);
                this.renderer.removeClass(this.el.nativeElement, `${base}-dark`);

                // Add current theme class
                this.renderer.addClass(this.el.nativeElement, `${base}-${mode}`);
            }

            // Also apply general theme mode class to host
            this.renderer.removeClass(this.el.nativeElement, 'theme-light');
            this.renderer.removeClass(this.el.nativeElement, 'theme-dark');
            this.renderer.addClass(this.el.nativeElement, `theme-${mode}`);
        });
    }
}
