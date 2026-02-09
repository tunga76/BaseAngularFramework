import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupAdapter } from '@platform/framework';
import { MaterialDialogComponent } from '@platform/ui-feedback';

@Injectable()
export class MaterialDialogPopupAdapter implements PopupAdapter {
    private dialog = inject(MatDialog);

    showError(message: string, title?: string): void {
        this.openDialog(message, title || 'Error', 'danger');
    }

    showSuccess(message: string, title?: string): void {
        this.openDialog(message, title || 'Success', 'success');
    }

    showInfo(message: string, title?: string): void {
        this.openDialog(message, title || 'Information', 'info');
    }

    showWarning(message: string, title?: string): void {
        this.openDialog(message, title || 'Warning', 'warning');
    }

    private openDialog(message: string, title: string, type: string): void {
        this.dialog.open(MaterialDialogComponent, {
            data: {
                message,
                title,
                showCancel: false,
                confirmText: 'OK',
                type
            },
            panelClass: 'modern-dialog-panel'
        });
    }
}
