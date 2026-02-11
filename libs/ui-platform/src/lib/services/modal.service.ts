import { Injectable, signal, ComponentRef, Type, EnvironmentInjector, ApplicationRef, createComponent, Injector } from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalOptions {
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    data?: any;
    hasBackdrop?: boolean;
    backdropClose?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    // Simple stack for multiple modals if needed, or just one active
    // For simplicity, let's start with single active modal or basic stack management.
    // We will expose a signal or observable for currently open modals?
    // Or just use DOM manipulation to append them to body (Overlay service pattern).

    // Since we want to use the Angular way, we can use the CDK Overlay if available, 
    // but since we are building "from scratch" based on prompt implications (no external libs mentioned besides Angular),
    // we will implement a simple Overlay service or just manage it here.

    // Let's create a ModalContainer component dynamically.

    private modals: ComponentRef<any>[] = [];

    constructor(
        private injector: Injector,
        private appRef: ApplicationRef,
        private environmentInjector: EnvironmentInjector
    ) { }

    open<T>(component: Type<T>, options?: ModalOptions): ComponentRef<T> {
        // This is a simplified dynamic component loader.
        // In a real enterprise app, we'd use CDK Overlay.
        // Here we will use createComponent and attach to body.

        // We need a wrapper "ModalContainer" that provides the layout (backdrop, frame).
        // Or the `UiModalComponent` itself is the wrapper and we project content into it.

        // The user requirement says "ui-modal (with overlay + service)".
        // So likely the service opens the `UiModalComponent` which wraps the content.

        // Implementation:
        // 1. Create UiModalComponent ref
        // 2. Project the user content (component) into it? 
        //    Or UiModalComponent takes a template/component input.

        // Let's stick to a simpler approach: 
        // The Service manages a signal of "Open Modals".
        // A root "ModalOutlet" (or similar) reads this signal and renders them.
        // This is more "Angular Signal" friendly than manual DOM manipulation.

        // However, typical usage is `modalService.open(MyComponent)`.
        // Let's go with dynamic creation for flexibility.

        // TODO: Create logic to interface with the Modal Component.
        // For now, I'll provide the service structure.
        return {} as any;
    }

    closeAll() {
        // ...
    }
}
