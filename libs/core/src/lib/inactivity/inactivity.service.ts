import { Injectable, inject, NgZone } from '@angular/core';
import {
    fromEvent,
    merge,
    Observable,
    Subject,
    timer,
    of,
    EMPTY
} from 'rxjs';
import {
    switchMap,
    throttleTime,
    tap,
    filter,
    map,
    distinctUntilChanged,
    shareReplay
} from 'rxjs/operators';
import { CORE_CONFIG } from '../config/core-config';

@Injectable({ providedIn: 'root' })
export class InactivityService {
    private config = inject(CORE_CONFIG);
    private ngZone = inject(NgZone);

    private lastActivityKey = 'platform_last_activity';
    private activity$ = new Subject<void>();

    // Public events
    readonly timeout$ = new Subject<void>();
    readonly warning$ = new Subject<boolean>();

    constructor() {
        if (this.config.inactivity?.enabled) {
            this.initActivityTracking();
        }
    }

    private initActivityTracking(): void {
        const config = this.config.inactivity!;

        // 1. Sens activity from DOM events
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

        // Use NgZone.runOutsideAngular for event listeners to avoid change detection on every mouse move
        this.ngZone.runOutsideAngular(() => {
            merge(...events.map(e => fromEvent(document, e)))
                .pipe(
                    throttleTime(2000), // Only track activity every 2 seconds
                    tap(() => this.recordActivity())
                )
                .subscribe();

            // 2. Listen for activity in other tabs via storage events
            fromEvent<StorageEvent>(window, 'storage')
                .pipe(
                    filter(e => e.key === this.lastActivityKey),
                    tap(() => this.activity$.next())
                )
                .subscribe();

            // 3. Idle Timer Logic
            this.activity$.pipe(
                switchMap(() => {
                    const totalTimeout = config.idleTimeoutMs;
                    const warningTime = config.warningBeforeMs || 0;

                    if (warningTime > 0) {
                        // Emit warning before actual timeout
                        return timer(totalTimeout - warningTime).pipe(
                            tap(() => this.ngZone.run(() => this.warning$.next(true))),
                            switchMap(() => timer(warningTime)),
                            tap(() => this.ngZone.run(() => this.timeout$.next()))
                        );
                    } else {
                        return timer(totalTimeout).pipe(
                            tap(() => this.ngZone.run(() => this.timeout$.next()))
                        );
                    }
                })
            ).subscribe();
        });

        // Start initial timer
        this.recordActivity();
    }

    private recordActivity(): void {
        const timestamp = Date.now().toString();
        localStorage.setItem(this.lastActivityKey, timestamp);
        this.activity$.next();
        this.warning$.next(false);
    }

    reset(): void {
        this.recordActivity();
    }
}
