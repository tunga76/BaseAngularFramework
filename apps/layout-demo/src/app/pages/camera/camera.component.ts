import { Component, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CameraWebSocketService } from '../../websocket/camera/camera-websocket.service';
import { UserCameraModel } from '../../websocket/camera/user-camera.model';

@Component({
    selector: 'app-camera-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './camera.component.html',
    styleUrl: './camera.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraViewComponent implements AfterViewInit, OnDestroy {

    @ViewChild('livecam') livecamRef!: ElementRef<HTMLImageElement>;

    private ctx!: CanvasRenderingContext2D;

    public state$ = signal<'CONNECTED' | 'RETRYING' | 'FAILED' | 'DISCONNECTED'>('CONNECTED');
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

    // @ViewChild('cameraCanvas', { static: true })
    // canvasRef!: ElementRef<HTMLCanvasElement>;

    // ngAfterViewInit() {
    //     this.camera.connect(this.userCameraModel);
    //     const canvas = this.canvasRef.nativeElement;
    //     canvas.width = 150;
    //     canvas.height = 150;
    //     this.ctx = canvas.getContext('2d')!;

    //     this.sub = this.camera.frame$
    //         .subscribe(base64 => {
    //             return this.drawFrame(base64.toString());
    //         });
    // }

    // drawFrame(base64: string) {

    //     const canvas = this.canvasRef.nativeElement;
    //     const img = new Image();

    //     img.onload = () => {
    //         this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    //     };

    //     img.src = `data:image/jpeg;base64,${base64}`;
    // }

    ngAfterViewInit(): void {

        this.camera.connect(this.userCameraModel);

        this.sub = this.camera.frame$
            .subscribe(base64 => {
                this.livecamRef.nativeElement.src =
                    `data:image/jpeg;base64,${base64}`;
            });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
        this.camera.disconnect();
    }
}
