import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { ConfirmOptions, ConfirmService, AlertService, ToastService, ToastOptions, ToastType } from './ui-interfaces';
import { MaterialDialogComponent } from './components/material-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class MaterialUiService implements ConfirmService, AlertService, ToastService {
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);

    ask(message: string, options?: ConfirmOptions): Observable<boolean> {
        const dialogRef = this.dialog.open(MaterialDialogComponent, {
            data: {
                message,
                title: options?.title || 'Confirm',
                showCancel: true,
                confirmText: options?.confirmText,
                cancelText: options?.cancelText,
                type: options?.type
            },
            panelClass: 'modern-dialog-panel'
        });

        return dialogRef.afterClosed().pipe(
            map(result => !!result)
        ) as Observable<boolean>;
    }

    success(message: string): void {
        this.showAlert(message, 'Success', 'success');
    }

    error(message: string): void {
        this.showAlert(message, 'Error', 'danger');
    }

    info(message: string): void {
        this.showAlert(message, 'Information', 'info');
    }

    warn(message: string): void {
        this.showAlert(message, 'Warning', 'warning');
    }

    show(message: string, options?: ToastOptions | number): void {
        let duration = 3000;
        let type: ToastType | undefined;
        let action = 'Close';
        let horizontalPosition: any = 'right';
        let verticalPosition: any = 'top';

        if (typeof options === 'number') {
            duration = options;
        } else if (options) {
            duration = options.duration || 3000;
            type = options.type;
            action = options.action || 'Close';
            horizontalPosition = options.horizontalPosition || 'right';
            verticalPosition = options.verticalPosition || 'top';
        }

        const config: MatSnackBarConfig = {
            duration,
            horizontalPosition,
            verticalPosition,
            panelClass: type ? [`snack-${type}`] : undefined
        };

        this.snackBar.open(message, action, config);
    }

    private showAlert(message: string, title: string, type: any): void {
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
