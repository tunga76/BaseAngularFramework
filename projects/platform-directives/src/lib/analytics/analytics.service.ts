import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    /**
     * Track a custom event.
     * This is an abstraction for analytics providers like Google Analytics, Mixpanel, etc.
     */
    trackEvent(eventName: string, properties?: Record<string, any>) {
        console.log(`[Analytics] Event: ${eventName}`, properties);
        // Implementation for external providers would go here
    }
}
