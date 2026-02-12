import { Component, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CameraWebSocketService } from '../../websocket/camera/camera-websocket.service';
import { UserCameraModel } from '../../websocket/camera/user-camera.model';

@Component({
    selector: 'app-camera-view',
    standalone: true,
    imports: [CommonModule],
    template: `<img #img class="camera-frame" />`,
    // templateUrl: './camera.component.html',
    // styleUrl: './camera.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraViewComponent implements AfterViewInit, OnDestroy {

    @ViewChild('img') imgRef!: ElementRef<HTMLImageElement>;
    public state = signal<'CONNECTED' | 'RETRYING' | 'FAILED' | 'DISCONNECTED'>('CONNECTED');
    private sub?: Subscription;
    private userCameraModel: UserCameraModel = {
        id: 1,
        ipAdresi: 'localhost',
        kameraIpAdresi: 'localhost',
        kameraMarkasi: '1',
        connectAdress: '1',
        kullaniciAdi: 'admin',
        parola: 'admin',
        hudutKapisiAd: 'admin'
    };

    constructor(private camera: CameraWebSocketService) { }

    ngAfterViewInit(): void {

        this.camera.connect(JSON.stringify(this.userCameraModel));

        this.sub = this.camera.frame$
            .subscribe(base64 => {
                this.imgRef.nativeElement.src =
                    `data:image/jpeg;base64,${base64}`;
            });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
        this.camera.disconnect();
    }
}
