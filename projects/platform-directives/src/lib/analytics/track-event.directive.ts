import { Directive, Input, HostListener, inject } from '@angular/core';
import { AnalyticsService } from './analytics.service';

/**
 * Directive to track events on click or other interactions.
 * Usage: <button appTrackEvent="user_save_click" [eventProps]="{ id: 123 }">Save</button>
 */
@Directive({
    selector: '[appTrackEvent]',
    standalone: true,
})
export class TrackEventDirective {
    private analyticsService = inject(AnalyticsService);

    @Input('appTrackEvent') eventName!: string;
    @Input() eventProps?: Record<string, any>;

    @HostListener('click')
    onClick() {
        if (this.eventName) {
            this.analyticsService.trackEvent(this.eventName, this.eventProps);
        }
    }
}
