import { Directive, Input, ElementRef, Renderer2, inject, effect, signal } from '@angular/core';

/**
 * Directive to show a loading overlay on an element.
 * Usage: <div [appLoading]="isLoading">Content</div>
 */
@Directive({
    selector: '[appLoading]',
    standalone: true,
})
export class LoadingDirective {
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);

    private isLoading = signal(false);
    private overlay: HTMLElement | null = null;

    @Input('appLoading') set loading(val: boolean) {
        this.isLoading.set(val);
    }

    constructor() {
        effect(() => {
            const loading = this.isLoading();
            if (loading) {
                this.addOverlay();
            } else {
                this.removeOverlay();
            }
        });
    }

    private addOverlay() {
        if (this.overlay) return;

        this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
        this.overlay = this.renderer.createElement('div');
        this.renderer.addClass(this.overlay, 'platform-loading-overlay');

        // Simple inline styles to avoid external CSS dependencies if possible, 
        // but the user mentioned CSS class 'platform-loading'.
        this.renderer.addClass(this.el.nativeElement, 'platform-loading');

        this.renderer.appendChild(this.el.nativeElement, this.overlay);
    }

    private removeOverlay() {
        if (!this.overlay) return;

        this.renderer.removeClass(this.el.nativeElement, 'platform-loading');
        this.renderer.removeChild(this.el.nativeElement, this.overlay);
        this.overlay = null;
    }
}
