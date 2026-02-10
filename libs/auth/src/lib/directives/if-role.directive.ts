import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Directive({
    selector: '[ifRole]',
    standalone: true
})
export class IfRoleDirective {
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private authService = inject(AuthService);

    @Input() set ifRole(role: string | string[]) {
        const userRolesResult = this.authService.getPermissions(); // Assuming getPermissions includes roles
        const rolesToCheck = Array.isArray(role) ? role : [role];

        const hasRole = rolesToCheck.some(r => userRolesResult.includes(r));

        this.viewContainer.clear();
        if (hasRole) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
