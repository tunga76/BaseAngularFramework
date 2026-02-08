import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingAdapter } from '../adapters/loading.adapter';
import { MaterialLoadingComponent } from './material-loading.component';

@Injectable()
export class MaterialLoadingAdapter implements LoadingAdapter {
    private dialogRef: MatDialogRef<MaterialLoadingComponent> | null = null;

    constructor(private dialog: MatDialog) { }

    show(key?: string): void {
        if (!this.dialogRef) {
            this.dialogRef = this.dialog.open(MaterialLoadingComponent, {
                disableClose: true,
                panelClass: 'loading-dialog-container',
                hasBackdrop: true
            });
        }
    }

    hide(key?: string): void {
        if (this.dialogRef) {
            this.dialogRef.close();
            this.dialogRef = null;
        }
    }
}
