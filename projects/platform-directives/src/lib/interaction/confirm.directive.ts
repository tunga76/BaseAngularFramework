import { Directive, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import { ConfirmService } from './confirm.service';

/**
 * Directive to show a confirmation dialog before emitting a 'confirmed' event.
 * Usage: <button [appConfirm]="'Are you sure?'" (confirmed)="delete()">Delete</button>
 */
@Directive({
    selector: '[appConfirm]',
    standalone: true,
})
export class ConfirmDirective {
    private confirmService = inject(ConfirmService);

    @Input('appConfirm') message = 'Are you sure?';
    @Output() confirmed = new EventEmitter<void>();

    @HostListener('click', ['$event'])
    async onClick(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        const isConfirmed = await this.confirmService.confirm(this.message);
        if (isConfirmed) {
            this.confirmed.emit();
        }
    }
}
