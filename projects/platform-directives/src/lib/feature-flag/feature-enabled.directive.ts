import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect, signal } from '@angular/core';
import { FeatureStore } from './feature.store';

/**
 * Structural directive to show elements if a feature flag is enabled.
 * Usage: <button *appFeatureEnabled="'new-ui'">New Feature</button>
 */
@Directive({
    selector: '[appFeatureEnabled]',
    standalone: true,
})
export class FeatureEnabledDirective {
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private featureStore = inject(FeatureStore);

    private featureKey = signal<string | null>(null);

    @Input('appFeatureEnabled') set appFeatureEnabled(val: string) {
        this.featureKey.set(val);
    }

    constructor() {
        effect(() => {
            const key = this.featureKey();
            const isEnabled = key ? this.featureStore.isEnabled(key) : false;

            this.viewContainer.clear();
            if (isEnabled) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        });
    }
}
