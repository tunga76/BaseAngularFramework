import { Injectable } from '@angular/core';
import { connectionState, lastMessage } from './realtime.state';
import { RealtimeClient } from './realtime.client';

@Injectable({ providedIn: 'root' })
export class RealtimeFacade {

    constructor(private client: RealtimeClient) { }

    state = connectionState;
    message = lastMessage;

    connect(url: string) {
        this.client.connect(url);
    }

    send(type: string, payload?: any) {
        this.client.send(type, payload);
    }

    disconnect() {
        this.client.disconnect();
    }
}
