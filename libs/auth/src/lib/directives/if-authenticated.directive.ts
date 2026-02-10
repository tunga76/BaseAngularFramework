import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../auth.service';

@Directive({
    selector: '[ifAuthenticated]',
    standalone: true
})
export class IfAuthenticatedDirective {
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private authService = inject(AuthService);

    private condition = true;

    constructor() {
        effect(() => {
            const isAuthenticated = this.authService.isAuthenticated();
            this.updateView(isAuthenticated);
        });
    }

    @Input() set ifAuthenticated(shouldBeAuthenticated: boolean) {
        this.condition = shouldBeAuthenticated;
        // Trigger manual update in case only input changed and signal didn't
        // But simpler: just rely on effect if signal changes. 
        // If input changes, we should re-evaluate. 
        // Since we can't easily trigger effect from input change without a signal input,
        // we call updateView manually here with current signal value.
        this.updateView(this.authService.isAuthenticated());
    }

    private updateView(isAuthenticated: boolean) {
        this.viewContainer.clear();

        if (isAuthenticated === this.condition) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
