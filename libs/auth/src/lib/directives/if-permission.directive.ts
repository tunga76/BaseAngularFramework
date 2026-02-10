import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Directive({
    selector: '[ifPermission]',
    standalone: true
})
export class IfPermissionDirective {
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private authService = inject(AuthService);

    @Input() set ifPermission(permission: string | string[]) {
        const userPermissions = this.authService.getPermissions();
        const permissionsToCheck = Array.isArray(permission) ? permission : [permission];

        const hasPermission = permissionsToCheck.some(p => userPermissions.includes(p));

        if (hasPermission) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
