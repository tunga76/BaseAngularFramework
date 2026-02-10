import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ConfirmOptions, ConfirmService, AlertService, ToastService, ToastOptions, ToastType } from './ui-interfaces';
import { MaterialDialogComponent } from './components/material-dialog.component';
import { UiLoggerService } from './logging/ui-logger.service';

@Injectable({
    providedIn: 'root'
})
export class MaterialUiService implements ConfirmService, AlertService, ToastService {
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);
    private logger = inject(UiLoggerService);

    ask(message: string, options?: ConfirmOptions): Observable<boolean> {
        try {
            const dialogRef = this.dialog.open(MaterialDialogComponent, {
                data: {
                    message,
                    title: options?.title || 'Confirm',
                    showCancel: true,
                    confirmText: options?.confirmText,
                    cancelText: options?.cancelText,
                    type: options?.type,
                    allowHtml: options?.allowHtml ?? false
                },
                panelClass: 'modern-dialog-panel',
                disableClose: false
            });

            return dialogRef.afterClosed().pipe(
                map(result => !!result),
                catchError(error => {
                    this.logger.logError('MaterialUiService.ask', error, { message, options });
                    return of(false);
                })
            ) as Observable<boolean>;
        } catch (error) {
            this.logger.logError('MaterialUiService.ask', error, { message, options });
            return of(false);
        }
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
        try {
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
        } catch (error) {
            this.logger.logError('MaterialUiService.show', error, { message, options });
        }
    }

    private showAlert(message: string, title: string, type: 'info' | 'success' | 'warning' | 'danger'): void {
        try {
            this.dialog.open(MaterialDialogComponent, {
                data: {
                    message,
                    title,
                    showCancel: false,
                    confirmText: 'OK',
                    type,
                    allowHtml: false
                },
                panelClass: 'modern-dialog-panel'
            });
        } catch (error) {
            this.logger.logError('MaterialUiService.showAlert', error, { message, title, type });
        }
    }
}
