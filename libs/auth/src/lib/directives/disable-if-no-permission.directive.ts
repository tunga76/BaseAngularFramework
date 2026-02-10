import { Directive, Input, ElementRef, Renderer2, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Directive({
    selector: '[disableIfNoPermission]',
    standalone: true
})
export class DisableIfNoPermissionDirective implements OnInit {
    private elementRef = inject(ElementRef);
    private renderer = inject(Renderer2);
    private authService = inject(AuthService);

    // Default to 'disabled' attribute, but could be extended to add a class
    @Input() disableIfNoPermission?: string | string[];

    ngOnInit() {
        this.updateState();
    }

    private updateState() {
        if (!this.disableIfNoPermission) {
            return;
        }

        const permissions = this.authService.getPermissions();
        const requiredPermissions = Array.isArray(this.disableIfNoPermission)
            ? this.disableIfNoPermission
            : [this.disableIfNoPermission];

        const hasPermission = requiredPermissions.some(p => permissions.includes(p));

        if (!hasPermission) {
            this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'true');
            this.renderer.addClass(this.elementRef.nativeElement, 'disabled-no-permission');
            this.renderer.setAttribute(this.elementRef.nativeElement, 'title', 'You do not have permission to perform this action.');
        } else {
            this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled');
            this.renderer.removeClass(this.elementRef.nativeElement, 'disabled-no-permission');
        }
    }
}
