import { signal } from '@angular/core';
import { RealtimeConnectionState, RealtimeEnvelope } from './realtime.types';

export const connectionState = signal<RealtimeConnectionState>(
    RealtimeConnectionState.DISCONNECTED
);

export const lastMessage = signal<RealtimeEnvelope | null>(null);

export const retryCount = signal(0);
