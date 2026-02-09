import { Directive, EventEmitter, HostListener, Input, Output, OnInit, OnDestroy, signal, effect, inject, DestroyRef } from '@angular/core';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Directive to debounce click events.
 * Usage: <button appDebounceClick [debounceTime]="500" (debouncedClick)="save()">Save</button>
 */
@Directive({
    selector: '[appDebounceClick]',
    standalone: true,
})
export class DebounceClickDirective implements OnInit {
    @Input() debounceTime = 500;
    @Output() debouncedClick = new EventEmitter<MouseEvent>();

    private clicks = new Subject<MouseEvent>();
    private readonly destroyRef = inject(DestroyRef);

    ngOnInit() {
        this.clicks
            .pipe(
                debounceTime(this.debounceTime),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((event) => this.debouncedClick.emit(event));
    }

    @HostListener('click', ['$event'])
    clickEvent(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }
}
