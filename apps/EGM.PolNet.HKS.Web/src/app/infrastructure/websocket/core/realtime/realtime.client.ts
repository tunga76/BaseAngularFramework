import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { timer } from 'rxjs';
import { v4 as uuid } from 'uuid';

import {
    connectionState,
    lastMessage,
    retryCount
} from './realtime.state';

import {
    RealtimeEnvelope,
    RealtimeConnectionState
} from './realtime.types';

@Injectable({ providedIn: 'root' })
export class RealtimeClient {

    private socket$?: WebSocketSubject<RealtimeEnvelope>;
    private currentUrl?: string;
    private heartbeatSub?: any;

    connect(url: string) {

        this.currentUrl = url;

        connectionState.set(RealtimeConnectionState.CONNECTING);

        this.socket$ = webSocket<RealtimeEnvelope>({
            url,
            openObserver: {
                next: () => {
                    retryCount.set(0);
                    connectionState.set(RealtimeConnectionState.CONNECTED);
                    this.startHeartbeat();
                }
            },
            closeObserver: {
                next: () => {
                    this.stopHeartbeat();
                    this.retry();
                }
            }
        });

        this.socket$.subscribe({
            next: msg => this.handleIncoming(msg),
            error: () => this.retry()
        });
    }

    send<T>(type: string, payload?: T) {

        const envelope: RealtimeEnvelope<T> = {
            id: uuid(),
            correlationId: crypto.randomUUID(),
            type: type as any,
            timestamp: Date.now(),
            payload
        };

        this.socket$?.next(envelope);
    }

    private handleIncoming(message: RealtimeEnvelope) {

        if (message.type === 'PONG') return;

        lastMessage.set(message);
    }

    private retry() {

        const attempt = retryCount() + 1;
        retryCount.set(attempt);

        if (attempt > 10) {
            connectionState.set(RealtimeConnectionState.FAILED);
            return;
        }

        connectionState.set(RealtimeConnectionState.RETRYING);

        const delay = this.getBackoffDelay(attempt);

        timer(delay).subscribe(() => {
            if (this.currentUrl) {
                this.connect(this.currentUrl);
            }
        });
    }

    private getBackoffDelay(attempt: number): number {
        return Math.min(1000 * Math.pow(2, attempt), 60000);
    }

    private startHeartbeat() {
        this.heartbeatSub = timer(0, 15000).subscribe(() => {
            this.send('PING');
        });
    }

    private stopHeartbeat() {
        this.heartbeatSub?.unsubscribe();
    }

    disconnect() {
        this.stopHeartbeat();
        this.socket$?.complete();
        connectionState.set(RealtimeConnectionState.DISCONNECTED);
    }
}
