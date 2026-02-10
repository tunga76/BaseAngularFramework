import { Injectable, inject, InjectionToken, PLATFORM_ID, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ObservabilityConfig, TrackingEvent } from './observability-interfaces';

export const OBSERVABILITY_CONFIG = new InjectionToken<ObservabilityConfig>('PLATFORM_OBSERVABILITY_CONFIG');

@Injectable({ providedIn: 'root' })
export class TrackerService {
    private config = inject(OBSERVABILITY_CONFIG);
    private platformId = inject(PLATFORM_ID);
    private destroyRef = inject(DestroyRef);

    private eventQueue: TrackingEvent[] = [];
    private batchTimer?: ReturnType<typeof setTimeout>;
    private readonly batchSize: number;
    private readonly batchIntervalMs: number;
    private readonly samplingRate: number;

    constructor() {
        this.batchSize = this.config.batchSize ?? 10;
        this.batchIntervalMs = this.config.batchIntervalMs ?? 5000;
        this.samplingRate = this.config.samplingRate ?? 1.0;

        // Cleanup batch timer on destroy
        this.destroyRef.onDestroy(() => {
            if (this.batchTimer) {
                clearTimeout(this.batchTimer);
                this.flushQueue(); // Send any remaining events
            }
        });
    }

    track(name: string, properties?: Record<string, any>): void {
        if (!this.shouldTrack()) return;

        const event: TrackingEvent = {
            name,
            properties,
            timestamp: Date.now()
        };

        this.eventQueue.push(event);

        // Flush immediately if batch size is reached
        if (this.eventQueue.length >= this.batchSize) {
            this.flushQueue();
        } else {
            // Schedule a flush if not already scheduled
            if (!this.batchTimer) {
                this.batchTimer = setTimeout(() => {
                    this.flushQueue();
                }, this.batchIntervalMs);
            }
        }
    }

    trackError(error: any, context?: string): void {
        if (!this.shouldTrack()) return;

        // Errors are sent immediately (not batched) for urgency
        this.config.plugins.forEach(plugin => {
            this.executePlugin(() => plugin.trackError(error, context), plugin.name);
        });
    }

    private shouldTrack(): boolean {
        // SSR safety
        if (!isPlatformBrowser(this.platformId)) return false;

        // Feature flag
        if (!this.config.enabled) return false;

        // Sampling: random check against sampling rate
        if (this.samplingRate < 1.0 && Math.random() > this.samplingRate) {
            return false;
        }

        return true;
    }

    private flushQueue(): void {
        if (this.eventQueue.length === 0) return;

        const eventsToSend = [...this.eventQueue];
        this.eventQueue = [];

        // Clear the timer
        if (this.batchTimer) {
            clearTimeout(this.batchTimer);
            this.batchTimer = undefined;
        }

        // Send to all plugins
        eventsToSend.forEach(event => {
            this.config.plugins.forEach(plugin => {
                this.executePlugin(() => plugin.trackEvent(event), plugin.name);
            });
        });
    }

    private executePlugin(fn: () => void | Promise<void>, pluginName: string): void {
        try {
            const result = fn();
            if (result instanceof Promise) {
                result.catch(e => {
                    console.error(`[Observability] Plugin "${pluginName}" failed:`, e);
                });
            }
        } catch (e) {
            console.error(`[Observability] Plugin "${pluginName}" failed:`, e);
        }
    }
}
