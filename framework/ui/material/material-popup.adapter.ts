import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopupAdapter } from '../adapters/popup.adapter';

@Injectable()
export class MaterialPopupAdapter implements PopupAdapter {

    constructor(private snackBar: MatSnackBar) { }

    showError(message: string, title?: string): void {
        this.snackBar.open(`${title ? title + ': ' : ''}${message}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
        });
    }

    showSuccess(message: string, title?: string): void {
        this.snackBar.open(`${title ? title + ': ' : ''}${message}`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
        });
    }

    showInfo(message: string, title?: string): void {
        this.snackBar.open(`${title ? title + ': ' : ''}${message}`, 'Close', {
            duration: 3000,
            panelClass: ['info-snackbar']
        });
    }

    showWarning(message: string, title?: string): void {
        this.snackBar.open(`${title ? title + ': ' : ''}${message}`, 'Close', {
            duration: 4000,
            panelClass: ['warning-snackbar']
        });
    }
}
