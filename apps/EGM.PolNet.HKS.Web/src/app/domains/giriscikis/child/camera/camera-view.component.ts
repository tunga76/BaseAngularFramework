import { Component, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ViewChild, ElementRef, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FaceDetectionService } from './services/face-detection.service';
import { faceDetectionEnums } from 'apps/layout-demo/src/app/features/document/enums/face-detection-status.enum';
import { UserCameraModel } from 'apps/layout-demo/src/app/websocket/camera/user-camera.model';
import { CameraWebSocketService } from 'apps/layout-demo/src/app/websocket/camera/camera-websocket.service';

@Component({
    selector: 'app-camera-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './camera-view.component.html',
    styleUrl: './camera-view.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraViewComponent implements AfterViewInit, OnDestroy {

    @ViewChild('livecam') livecamRef!: ElementRef<HTMLImageElement>;
    @ViewChild('overlayCanvas') overlayCanvasRef!: ElementRef<HTMLCanvasElement>;

    FaceDetectionEnums = faceDetectionEnums;

    // Sync state from service
    public state$ = this.camera.state$;

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

    private canvasCtx!: CanvasRenderingContext2D;
    private destroyRef = inject(DestroyRef);

    constructor(
        private camera: CameraWebSocketService,
        private faceDetection: FaceDetectionService
    ) { }

    async ngAfterViewInit(): Promise<void> {
        // Init Canvas
        this.canvasCtx = this.overlayCanvasRef.nativeElement.getContext('2d')!;

        // Init Detector
        try {
            await this.faceDetection.init();
        } catch (err) {
            console.error('Face detection init failed', err);
        }

        // Connect Camera
        this.camera.connect(this.userCameraModel);

        // Frame Subscription
        this.sub = this.camera.frame$
            .subscribe(base64 => {
                if (this.livecamRef?.nativeElement) {
                    const img = this.livecamRef.nativeElement;
                    img.src = `data:image/jpeg;base64,${base64}`;

                    // Detect faces after image load/update
                    // Using requestAnimationFrame to decouple detection from source update
                    requestAnimationFrame(() => this.runDetection(img));
                }
            });
    }

    private runDetection(img: HTMLImageElement) {
        if (!img.complete || img.naturalWidth === 0) return;

        // Correct canvas size to match image natural size
        const canvas = this.overlayCanvasRef.nativeElement;
        if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
        }

        try {
            const detections = this.faceDetection.detectFromVideo(img as any, Date.now());
            this.drawDetections(detections);
        } catch (err) {
            // Detector might not be ready yet
        }
    }

    private drawDetections(detections: any[]) {
        const ctx = this.canvasCtx;
        const canvas = this.overlayCanvasRef.nativeElement;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(34, 197, 94, 0.5)';
        ctx.shadowBlur = 10;

        for (const detection of detections) {
            const { originX, originY, width, height } = detection.boundingBox;

            // Draw bounding box
            ctx.strokeRect(originX, originY, width, height);

            // Optional: Draw corner marks for a more "tech" look
            this.drawTechCorners(ctx, originX, originY, width, height);
        }
    }

    private drawTechCorners(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        const len = 10;
        ctx.beginPath();
        // Top Left
        ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
        // Top Right
        ctx.moveTo(x + w - len, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + len);
        // Bottom Right
        ctx.moveTo(x + w, y + h - len); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - len, y + h);
        // Bottom Left
        ctx.moveTo(x + len, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - len);
        ctx.stroke();
    }

    restartDetection() {
        this.canvasCtx.clearRect(0, 0, this.overlayCanvasRef.nativeElement.width, this.overlayCanvasRef.nativeElement.height);
        // If there's persistent state in service, reset it here
        console.log('Detection restarted');
    }

    addCameraImageToParentItem(status: faceDetectionEnums) {
        const canvas = document.createElement('canvas');
        const img = this.livecamRef.nativeElement;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0);
            const capturedData = canvas.toDataURL('image/jpeg');
            console.log(`Captured with status: ${status}`, capturedData.substring(0, 50) + '...');
            // In a real app, you'd emit this to a parent component or service
        }
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
        this.camera.disconnect();
        this.faceDetection.destroy();
    }
}
