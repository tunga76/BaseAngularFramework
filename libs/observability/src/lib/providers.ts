import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ObservabilityConfig } from './observability-interfaces';
import { OBSERVABILITY_CONFIG } from './tracker.service';

export function provideObservability(config: ObservabilityConfig): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: OBSERVABILITY_CONFIG, useValue: config }
    ]);
}
