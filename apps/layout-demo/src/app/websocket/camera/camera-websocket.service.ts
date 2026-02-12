import { Injectable, NgZone, OnDestroy } from '@angular/core';
import {
    Subject,
    Observable,
    timer,
    Subscription,
    animationFrameScheduler
} from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CameraWebSocketService implements OnDestroy {

    private socket: WebSocket | null = null;
    private reconnectSub?: Subscription;
    private currentCameraModel?: string;

    private readonly socketUrl = "ws://localhost:8084";
    private readonly reconnectInterval = 5000;

    private frameSubject = new Subject<any>();

    // Max ~30 FPS
    public readonly frame$: Observable<any> =
        this.frameSubject.pipe(
            throttleTime(33, animationFrameScheduler, { trailing: true })
        );

    constructor(private zone: NgZone) {
        window.addEventListener('beforeunload', () => this.disconnect());
    }

    // --------------------------------------------------
    connect(cameraModel: string): void {

        if (this.socket?.readyState === WebSocket.OPEN) return;

        this.currentCameraModel = cameraModel;
        this.socket = new WebSocket(this.socketUrl);

        this.socket.onopen = () => {
            this.send(cameraModel);
        };

        this.socket.onmessage = (event: MessageEvent) => {
            this.handleMessage(event.data);
        };

        this.socket.onclose = () => {
            this.scheduleReconnect();
        };

        this.socket.onerror = (err) => {
            this.scheduleReconnect();
        };
    }

    // --------------------------------------------------
    private handleMessage(raw: string): void {

        let parsed: any;

        try {
            parsed = JSON.parse(raw);
        } catch {
            return;
        }

        // Backend PascalCase veya farklı isimler kullanıyor olabilir. 
        const data = parsed.data || parsed.Data || parsed.base64 || parsed.Base64;

        if (data) {
            this.zone.runOutsideAngular(() => {
                this.frameSubject.next(data);
            });
        }
    }

    // --------------------------------------------------
    send(message: any): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            const data = typeof message === 'string' ? message : JSON.stringify(message);
            this.socket.send(data);
        }
    }

    // --------------------------------------------------
    private scheduleReconnect(): void {

        if (!this.currentCameraModel) return;
        if (this.reconnectSub) return;

        this.reconnectSub = timer(this.reconnectInterval)
            .subscribe(() => {
                this.reconnectSub = undefined;
                this.connect(this.currentCameraModel!);
            });
    }

    // --------------------------------------------------
    disconnect(): void {

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
