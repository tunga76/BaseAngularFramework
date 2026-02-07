import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[hasPermission]',
    standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
    @Input('hasPermission') requiredPermission!: string;
    private sub?: Subscription;
    private hasView = false;

    constructor(
        private authService: AuthService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) { }

    ngOnInit() {
        this.sub = this.authService.getUserClaims().subscribe(claims => {
            if (!claims) {
                this.viewContainer.clear();
                this.hasView = false;
                return;
            }

            const scopes = (claims['scope'] || '').split(' ');
            const permissions = (claims['permissions'] || []);
            const hasPermission = scopes.includes(this.requiredPermission) || permissions.includes(this.requiredPermission);

            if (hasPermission && !this.hasView) {
                this.viewContainer.createEmbeddedView(this.templateRef);
                this.hasView = true;
            } else if (!hasPermission && this.hasView) {
                this.viewContainer.clear();
                this.hasView = false;
            }
        });
    }

    ngOnDestroy() {
        this.sub?.unsubscribe();
    }
}
