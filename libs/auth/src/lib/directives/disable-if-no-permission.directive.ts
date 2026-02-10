import { Directive, Input, ElementRef, Renderer2, inject, effect } from '@angular/core';
import { AuthService } from '../auth.service';

@Directive({
    selector: '[disableIfNoPermission]',
    standalone: true
})
export class DisableIfNoPermissionDirective {
    private elementRef = inject(ElementRef);
    private renderer = inject(Renderer2);
    private authService = inject(AuthService);

    private _requiredPermission?: string | string[];

    @Input('disableIfNoPermission') set requiredPermission(val: string | string[] | undefined) {
        this._requiredPermission = val;
        this.updateState();
    }

    constructor() {
        effect(() => {
            this.authService.getPermissions();
            this.updateState();
        });
    }

    private updateState() {
        if (!this._requiredPermission) {
            return;
        }

        const permissions = this.authService.getPermissions();
        const requiredPermissions = Array.isArray(this._requiredPermission)
            ? this._requiredPermission
            : [this._requiredPermission];

        const hasPermission = requiredPermissions.some(p => permissions.includes(p));

        const el = this.elementRef.nativeElement;

        if (!hasPermission) {
            this.renderer.setAttribute(el, 'disabled', 'true');
            this.renderer.addClass(el, 'disabled-no-permission');
            this.renderer.setAttribute(el, 'title', 'You do not have permission to perform this action.');
        } else {
            this.renderer.removeAttribute(el, 'disabled');
            this.renderer.removeClass(el, 'disabled-no-permission');
            this.renderer.removeAttribute(el, 'title');
        }
    }
}
