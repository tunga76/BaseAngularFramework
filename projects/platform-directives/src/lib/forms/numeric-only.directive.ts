import { Directive, HostListener, inject, ElementRef } from '@angular/core';

/**
 * Directive to allow only numeric input.
 * Usage: <input type="text" appNumericOnly>
 */
@Directive({
    selector: 'input[appNumericOnly]',
    standalone: true,
})
export class NumericOnlyDirective {
    private el = inject(ElementRef);

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End'
        ];

        if (allowedKeys.indexOf(event.key) !== -1 ||
            (event.key === 'a' && (event.ctrlKey || event.metaKey)) ||
            (event.key === 'c' && (event.ctrlKey || event.metaKey)) ||
            (event.key === 'v' && (event.ctrlKey || event.metaKey)) ||
            (event.key === 'x' && (event.ctrlKey || event.metaKey))) {
            return;
        }

        if (event.key === ' ' || isNaN(Number(event.key))) {
            event.preventDefault();
        }
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        const data = event.clipboardData?.getData('text');
        if (data && !/^\d+$/.test(data)) {
            event.preventDefault();
        }
    }
}
