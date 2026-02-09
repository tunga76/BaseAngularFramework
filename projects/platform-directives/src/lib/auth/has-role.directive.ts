import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect, signal } from '@angular/core';
import { AuthStore } from './auth.store';

/**
 * Structural directive to show elements based on user roles.
 * Usage: <div *appHasRole="['Admin', 'Manager']">Reserved for admins</div>
 */
@Directive({
    selector: '[appHasRole]',
    standalone: true,
})
export class HasRoleDirective {
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private authStore = inject(AuthStore);

    private roles = signal<string[]>([]);

    @Input('appHasRole') set appHasRole(val: string | string[]) {
        this.roles.set(Array.isArray(val) ? val : [val]);
    }

    constructor() {
        effect(() => {
            const rolesToCheck = this.roles();
            const hasRole = this.authStore.hasRole(rolesToCheck);

            this.viewContainer.clear();
            if (hasRole) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        });
    }
}
