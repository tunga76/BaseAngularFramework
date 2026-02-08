export interface TrackingEvent {
    name: string;
    properties?: Record<string, any>;
    timestamp: number;
}

export abstract class ObservabilityPlugin {
    abstract name: string;
    abstract trackEvent(event: TrackingEvent): void;
    abstract trackError(error: any, context?: string): void;
}

export interface ObservabilityConfig {
    enabled: boolean;
    plugins: ObservabilityPlugin[];
    trackRouteChanges?: boolean;
    trackApiPerformance?: boolean;
}
