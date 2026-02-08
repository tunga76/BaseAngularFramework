import { Injectable, inject, InjectionToken } from '@angular/core';
import { ObservabilityConfig, TrackingEvent } from './observability-interfaces';

export const OBSERVABILITY_CONFIG = new InjectionToken<ObservabilityConfig>('PLATFORM_OBSERVABILITY_CONFIG');

@Injectable({ providedIn: 'root' })
export class TrackerService {
    private config = inject(OBSERVABILITY_CONFIG);

    track(name: string, properties?: Record<string, any>): void {
        if (!this.config.enabled) return;

        const event: TrackingEvent = {
            name,
            properties,
            timestamp: Date.now()
        };

        this.config.plugins.forEach(plugin => {
            try {
                plugin.trackEvent(event);
            } catch (e) {
                console.error(`Observability plugin ${plugin.name} failed`, e);
            }
        });
    }

    trackError(error: any, context?: string): void {
        if (!this.config.enabled) return;

        this.config.plugins.forEach(plugin => {
            try {
                plugin.trackError(error, context);
            } catch (e) {
                console.error(`Observability plugin ${plugin.name} failed`, e);
            }
        });
    }
}
