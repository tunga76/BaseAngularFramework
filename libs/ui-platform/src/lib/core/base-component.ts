import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';

export type UiSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type UiVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'flat' | 'elevated';

@Component({
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export abstract class BaseUiComponent {
    @Input() size: UiSize = 'md';
    @Input() variant: UiVariant = 'primary';
    @Input() disabled = false;

    @HostBinding('class.disabled')
    get isDisabled() { return this.disabled; }

    @HostBinding('attr.aria-disabled')
    get isAriaDisabled() { return this.disabled; }

    // Helper to get base classes based on inputs
    protected get baseClasses(): string[] {
        return [
            `size-${this.size}`,
            `variant-${this.variant}`,
            this.disabled ? 'disabled' : ''
        ];
    }
}
