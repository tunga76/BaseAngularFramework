import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Directive({
    selector: '[ifAuthenticated]',
    standalone: true
})
export class IfAuthenticatedDirective implements OnInit {
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private authService = inject(AuthService);

    @Input() set ifAuthenticated(shouldBeAuthenticated: boolean) {
        this.updateView(shouldBeAuthenticated);
    }

    ngOnInit() {
        // Default to checking if authenticated (true) if no value provided
        if (this.viewContainer.length === 0) {
            this.updateView(true);
        }
    }

    private updateView(shouldBeAuthenticated: boolean) {
        this.viewContainer.clear();

        const isAuthenticated = this.authService.isAuthenticated();

        if (isAuthenticated === shouldBeAuthenticated) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
