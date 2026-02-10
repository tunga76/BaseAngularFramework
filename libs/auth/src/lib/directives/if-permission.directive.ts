import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../auth.service';

@Directive({
    selector: '[ifPermission]',
    standalone: true
})
export class IfPermissionDirective {
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private authService = inject(AuthService);

    // Store requested permissions
    private permissionsToCheck: string[] = [];

    constructor() {
        effect(() => {
            // Register dependency on user permissions state by calling getPermissions()
            // This assumes getPermissions() internally accesses a signal (it does: state().userClaims)
            this.authService.getPermissions();
            // Re-evaluate view when permissions imply a change
            this.updateView();
        });
    }

    @Input() set ifPermission(permission: string | string[]) {
        this.permissionsToCheck = Array.isArray(permission) ? permission : [permission];
        this.updateView();
    }

    private updateView() {
        this.viewContainer.clear();

        // This call is now reactive in effect, or just a getter in setter
        // Actually, calling getPermissions() is cheap? Yes.
        const userPermissions = this.authService.getPermissions();
        const hasPermission = this.permissionsToCheck.some(p => userPermissions.includes(p));

        if (hasPermission) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
