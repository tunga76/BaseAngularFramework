import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect, signal } from '@angular/core';
import { AuthStore } from './auth.store';

/**
 * Structural directive to show elements based on user permissions.
 * Usage: <button *appHasPermission="'USER_CREATE'">Create</button>
 */
@Directive({
    selector: '[appHasPermission]',
    standalone: true,
})
export class HasPermissionDirective {
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private authStore = inject(AuthStore);

    private permission = signal<string | null>(null);

    @Input('appHasPermission') set appHasPermission(val: string) {
        this.permission.set(val);
    }

    constructor() {
        effect(() => {
            const perm = this.permission();
            const hasPerm = perm ? this.authStore.hasPermission(perm) : false;

            this.viewContainer.clear();
            if (hasPerm) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        });
    }
}
