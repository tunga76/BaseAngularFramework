import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../auth.service';

@Directive({
    selector: '[ifRole]',
    standalone: true
})
export class IfRoleDirective {
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private authService = inject(AuthService);

    private rolesToCheck: string[] = [];

    constructor() {
        effect(() => {
            this.authService.getPermissions();
            this.updateView();
        });
    }

    @Input() set ifRole(role: string | string[]) {
        this.rolesToCheck = Array.isArray(role) ? role : [role];
        this.updateView();
    }

    private updateView() {
        this.viewContainer.clear();

        const userRolesResult = this.authService.getPermissions();
        const hasRole = this.rolesToCheck.some(r => userRolesResult.includes(r));

        if (hasRole) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
