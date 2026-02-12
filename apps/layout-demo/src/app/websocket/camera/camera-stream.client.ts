import { Injectable, NgZone } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Subject, animationFrameScheduler } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CameraStreamClient {

  private socket$?: WebSocketSubject<any>;

  private frameSubject = new Subject<any>();
  public frame$ = this.frameSubject
    .pipe(
      // FPS control (max 30fps)
      throttleTime(33, animationFrameScheduler, {
        trailing: true
      })
    );

  constructor(private zone: NgZone) { }

  connect(url: string) {

    this.socket$ = webSocket<any>({
      url,
      deserializer: msg => msg.data // raw string
    });

    this.socket$.subscribe({
      next: frame => this.handleFrame(frame),
      error: err => console.error('Camera WS Error', err)
    });
  }

  private handleFrame(base64: any) {

    // Angular zone dışında çalıştırıyoruz
    this.zone.runOutsideAngular(() => {
      this.frameSubject.next(base64);
    });
  }

  disconnect() {
    this.socket$?.complete();
  }
}
