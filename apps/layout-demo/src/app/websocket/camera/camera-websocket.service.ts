import { Injectable, NgZone, OnDestroy, inject, DestroyRef, signal } from '@angular/core';
import {
    Subject,
    Observable,
    timer,
    Subscription,
    animationFrameScheduler
} from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { UserCameraModel } from './user-camera.model';
import { SocketData } from '../socket.data';

export type CameraConnectionState = 'CONNECTED' | 'RETRYING' | 'FAILED' | 'DISCONNECTED' | 'CONNECTING';

@Injectable({
    providedIn: 'root'
})
export class CameraWebSocketService implements OnDestroy {

    private socket: WebSocket | null = null;
    private reconnectSub?: Subscription;
    private currentCameraModel?: UserCameraModel;

    private readonly socketUrl = "ws://localhost:8084";
    private readonly reconnectInterval = 5000;

    private frameSubject = new Subject<SocketData>();
    private destroyRef = inject(DestroyRef);

    // UI State
    public state$ = signal<CameraConnectionState>('DISCONNECTED');

    // Max ~30 FPS
    public readonly frame$: Observable<SocketData> =
        this.frameSubject.pipe(
            throttleTime(33, animationFrameScheduler, { trailing: true })
        );

    constructor(private zone: NgZone) {
        // Angular destroy
        this.destroyRef.onDestroy(() => this.cleanup());

        // Browser lifecycle
        window.addEventListener('beforeunload', () => this.cleanup());
        window.addEventListener('pagehide', () => this.cleanup());
    }

    // --------------------------------------------------
    connect(cameraModel: UserCameraModel): void {

        if (this.socket &&
            (this.socket.readyState === WebSocket.OPEN ||
                this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        this.state$.set('CONNECTING');
        this.currentCameraModel = cameraModel;
        this.socket = new WebSocket(this.socketUrl);

        this.socket.onopen = () => {
            this.state$.set('CONNECTED');
            this.reconnectAttempts = 0;
            this.send(this.currentCameraModel);
        };

        this.socket.onmessage = (event: MessageEvent) => {
            this.handleMessage(event.data);
        };

        this.socket.onclose = () => {
            if (this.state$() !== 'DISCONNECTED') {
                this.scheduleReconnect();
            }
        };

        this.socket.onerror = (err) => {
            if (this.state$() !== 'DISCONNECTED') {
                this.scheduleReconnect();
            }
        };
    }

    private cleanup() {
        this.disconnect();
        this.frameSubject.complete();
    }

    // --------------------------------------------------
    private handleMessage(raw: string): void {

        let parsed: any;

        try {
            parsed = JSON.parse(raw);
        } catch {
            return;
        }

        const data = parsed.data || parsed.Data || parsed.base64 || parsed.Base64;

        if (data) {
            this.zone.runOutsideAngular(() => {
                this.frameSubject.next(data);
            });
        }
    }

    // --------------------------------------------------
    send(message: UserCameraModel | undefined): void {

        if (!message) return;

        if (this.socket &&
            (this.socket.readyState === WebSocket.OPEN ||
                this.socket.readyState === WebSocket.CONNECTING)) {
            this.socket.send(JSON.stringify(message));
        }
    }

    // --------------------------------------------------
    private reconnectAttempts = 0;
    private readonly maxReconnectAttempts = 10;

    private scheduleReconnect(): void {

        if (!this.currentCameraModel) return;
        if (this.reconnectSub) return;

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.state$.set('FAILED');
            return;
        }

        this.state$.set('RETRYING');

        const delay = Math.min(
            this.reconnectInterval * Math.pow(2, this.reconnectAttempts),
            30000 // max 30s
        );

        this.reconnectAttempts++;

        this.reconnectSub = timer(delay)
            .subscribe(() => {
                this.reconnectSub = undefined;
                this.connect(this.currentCameraModel!);
            });
    }

    // --------------------------------------------------
    disconnect(): void {
        this.state$.set('DISCONNECTED');
        this.reconnectSub?.unsubscribe();
        this.reconnectSub = undefined;

        if (this.socket) {
            this.socket.close(1000, 'Client disconnect');
            this.socket = null;
        }
    }

    ngOnDestroy(): void {
        this.disconnect();
        this.frameSubject.complete();
    }
}
