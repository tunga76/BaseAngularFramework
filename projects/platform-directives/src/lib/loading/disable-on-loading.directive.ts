import { Directive, Input, ElementRef, Renderer2, inject, effect, signal } from '@angular/core';
import { LoadingStore } from './loading.store';

/**
 * Directive to disable an element when a specific loading key is active in the LoadingStore.
 * Usage: <button appDisableOnLoading="saveUser">Save</button>
 */
@Directive({
    selector: '[appDisableOnLoading]',
    standalone: true,
})
export class DisableOnLoadingDirective {
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);
    private loadingStore = inject(LoadingStore);

    private loadingKey = signal<string | null>(null);

    @Input('appDisableOnLoading') set appDisableOnLoading(val: string) {
        this.loadingKey.set(val);
    }

    constructor() {
        effect(() => {
            const key = this.loadingKey();
            const isLoading = key ? this.loadingStore.isKeyLoading(key) : false;

            if (isLoading) {
                this.renderer.setProperty(this.el.nativeElement, 'disabled', true);
                this.renderer.addClass(this.el.nativeElement, 'is-loading');
            } else {
                this.renderer.setProperty(this.el.nativeElement, 'disabled', false);
                this.renderer.removeClass(this.el.nativeElement, 'is-loading');
            }
        });
    }
}
