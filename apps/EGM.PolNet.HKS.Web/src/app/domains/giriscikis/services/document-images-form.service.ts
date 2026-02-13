import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { ImagesDocumentModel } from '../../../infrastructure/features/document/models/images-document.model';
import { faceDetectionEnums } from '../../../infrastructure/features/document/enums/face-detection-status.enum';


@Injectable()
export class DocumentImagesFormService {

    constructor(
        private fb: FormBuilder,
    ) { }

    getFormArray(form: any): FormArray<FormControl<ImagesDocumentModel>> {
        return form.get('DocumentImages') as FormArray<FormControl<ImagesDocumentModel>>;
    }

    add(
        form: any,
        newItem: ImagesDocumentModel,
        isCamera: boolean
    ): void {

        if (!this.isValid(newItem)) return;

        const images = this.getFormArray(form);

        if (isCamera) {
            this.removeCameraImage(images);
        }

        // images.push(this.fb.control(newItem));

        // this.log(newItem.type);
    }

    remove(form: any, index: number): void {
        const images = this.getFormArray(form);

        if (index >= 0 && index < images.length) {
            images.removeAt(index);
        }
    }

    private removeCameraImage(images: FormArray<FormControl<ImagesDocumentModel>>): void {
        const index = images.controls.findIndex(ctrl =>
            [faceDetectionEnums.FaceDetection, faceDetectionEnums.UserTake]
            // .includes(ctrl.value.type)
        );

        if (index > -1) {
            images.removeAt(index);
        }
    }

    private isValid(item: ImagesDocumentModel): boolean {
        if (
            item.type === faceDetectionEnums.UserTake
            // && !this.girisCikisPageService.isValidBase64Image(item.imageUrl)
        ) {
            console.warn('Resim URL boş olamaz.');
            return false;
        }

        return true;
    }

    // private log(type: any): void {
    //     this.userActivityLogService.logUserActivity(
    //         GirisCikisYonetimUserEventEnums.UserAction,
    //         `Kameradan fotoğraf alındı: ${type}`
    //     );
    // }
}
