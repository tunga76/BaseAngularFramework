export interface TrackingEvent {
    name: string;
    properties?: Record<string, any>;
    timestamp: number;
}

export abstract class ObservabilityPlugin {
    abstract name: string;
    abstract trackEvent(event: TrackingEvent): void | Promise<void>;
    abstract trackError(error: any, context?: string): void | Promise<void>;
}

export interface ObservabilityConfig {
    enabled: boolean;
    plugins: ObservabilityPlugin[];
    trackRouteChanges?: boolean;
    trackApiPerformance?: boolean;

    // Batch processing configuration
    batchSize?: number;           // Default: 10 events
    batchIntervalMs?: number;     // Default: 5000ms (5 seconds)

    // Sampling configuration (0.0 - 1.0, where 1.0 = 100%)
    samplingRate?: number;        // Default: 1.0 (track everything)
}
