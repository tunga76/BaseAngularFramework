import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from './auth.service';

@Directive({
    selector: '[ifPermission]',
    standalone: true
})
export class IfPermissionDirective {
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private authService = inject(AuthService);

    @Input() set ifPermission(permission: string) {
        const permissions = this.authService.getPermissions();
        const hasPermission = permissions.includes(permission);

        if (hasPermission) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
