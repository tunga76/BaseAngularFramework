import { ObservabilityPlugin, TrackingEvent } from '@platform/observability';

export class ConsoleLoggerPlugin implements ObservabilityPlugin {
    name = 'ConsoleLogger';

    trackEvent(event: TrackingEvent): void {
        console.group(`[Observability] Event: ${event.name}`);
        console.log('Timestamp:', new Date(event.timestamp).toISOString());
        console.log('Properties:', event.properties);
        console.groupEnd();
    }

    trackError(error: any, context?: string): void {
        console.group(`[Observability] ERROR: ${context || 'Unknown context'}`);
        console.error('Error Details:', error);
        console.groupEnd();
    }
}
