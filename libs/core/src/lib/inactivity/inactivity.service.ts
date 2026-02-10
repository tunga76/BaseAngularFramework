import { Injectable, inject, NgZone, PLATFORM_ID, DestroyRef } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
    fromEvent,
    merge,
    Subject,
    timer
} from 'rxjs';
import {
    switchMap,
    throttleTime,
    tap,
    filter,
    takeUntil
} from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CORE_CONFIG } from '../config/core-config';
import { STORAGE_SERVICE } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class InactivityService {
    private config = inject(CORE_CONFIG);
    private ngZone = inject(NgZone);
    private platformId = inject(PLATFORM_ID);
    private document = inject(DOCUMENT);
    private storage = inject(STORAGE_SERVICE);
    private destroyRef = inject(DestroyRef);

    private lastActivityKey = 'platform_last_activity';
    private activity$ = new Subject<void>();

    // Public events
    readonly timeout$ = new Subject<void>();
    readonly warning$ = new Subject<boolean>();

    constructor() {
        if (this.config.inactivity?.enabled && isPlatformBrowser(this.platformId)) {
            this.initActivityTracking();
        }
    }

    private initActivityTracking(): void {
        const config = this.config.inactivity!;

        // 1. Sense activity from DOM events
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

        // Use NgZone.runOutsideAngular for event listeners to avoid change detection on every mouse move
        this.ngZone.runOutsideAngular(() => {
            merge(...events.map(e => fromEvent(this.document, e)))
                .pipe(
                    throttleTime(2000), // Only track activity every 2 seconds
                    tap(() => this.recordActivity()),
                    takeUntilDestroyed(this.destroyRef)
                )
                .subscribe();

            // 2. Listen for activity in other tabs via storage events
            if (this.document.defaultView) {
                fromEvent<StorageEvent>(this.document.defaultView, 'storage')
                    .pipe(
                        filter(e => e.key === this.lastActivityKey),
                        tap(() => this.activity$.next()),
                        takeUntilDestroyed(this.destroyRef)
                    )
                    .subscribe();
            }

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
                }),
                takeUntilDestroyed(this.destroyRef)
            ).subscribe();
        });

        // Start initial timer
        this.recordActivity();
    }

    private recordActivity(): void {
        const timestamp = Date.now().toString();
        this.storage.setItem(this.lastActivityKey, timestamp);
        this.activity$.next();
        this.warning$.next(false);
    }

    reset(): void {
        this.recordActivity();
    }

    /**
     * For testing purposes: Manually trigger the inactivity sequence
     */
    simulateTimeout(ms: number = 5000, warningMs: number = 2000): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.ngZone.runOutsideAngular(() => {
            timer(ms - warningMs).pipe(
                tap(() => this.ngZone.run(() => this.warning$.next(true))),
                switchMap(() => timer(warningMs)),
                tap(() => this.ngZone.run(() => this.timeout$.next())),
                takeUntilDestroyed(this.destroyRef)
            ).subscribe();
        });
    }
}
