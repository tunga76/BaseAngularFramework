import { Injectable } from '@angular/core';
import {
    FaceDetector,
    FilesetResolver,
    Detection
} from '@mediapipe/tasks-vision';

import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FaceDetectionService {

    private faceDetector: FaceDetector | null = null;
    private initializing: Promise<void> | null = null;
    private isInitialized = false;

    // -------------------------
    // INIT (idempotent)
    // -------------------------
    async init(): Promise<void> {

        if (this.isInitialized) return;
        if (this.initializing) return this.initializing;

        this.initializing = this.initializeDetector();

        await this.initializing;
        this.isInitialized = true;
        this.initializing = null;
    }

    private async initializeDetector(): Promise<void> {

        const filesetResolver = await FilesetResolver.forVisionTasks(
            `${environment.subPath}/assets/mediapipe/wasm`
        );

        try {
            this.faceDetector = await FaceDetector.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: `${environment.subPath}/assets/mediapipe/blaze_face_short_range.tflite`,
                    delegate: 'GPU'
                },
                runningMode: 'VIDEO'
            });
        } catch (err) {
            console.warn('GPU delegate failed. Falling back to CPU...', err);

            this.faceDetector = await FaceDetector.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: `${environment.subPath}/assets/mediapipe/blaze_face_short_range.tflite`,
                    delegate: 'CPU'
                },
                runningMode: 'VIDEO'
            });
        }
    }

    // -------------------------
    // VIDEO DETECTION (recommended)
    // -------------------------
    detectFromVideo(video: HTMLVideoElement, timestamp: number): Detection[] {
        if (!this.faceDetector) {
            throw new Error('FaceDetector not initialized.');
        }

        const result = this.faceDetector.detectForVideo(video, timestamp);
        return result.detections;
    }

    // -------------------------
    // IMAGE DETECTION (fallback)
    // -------------------------
    async detectFromImage(image: HTMLImageElement): Promise<Detection[]> {
        if (!this.faceDetector) {
            throw new Error('FaceDetector not initialized.');
        }

        const result = this.faceDetector.detect(image);
        return result.detections;
    }

    // -------------------------
    // Destroy (important for SPA)
    // -------------------------
    destroy(): void {
        this.isInitialized = false;
        if (this.faceDetector) {
            this.faceDetector.close();
            this.faceDetector = null;
        }
    }
}
