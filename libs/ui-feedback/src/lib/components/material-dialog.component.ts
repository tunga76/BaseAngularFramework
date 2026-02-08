import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'platform-material-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header__clean" [ngClass]="data.type || 'info'">
        <mat-icon>{{ getIcon() }}</mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button *ngIf="data.showCancel" (click)="onCancel()" class="cancel-button">{{ data.cancelText || 'Cancel' }}</button>
        <button mat-raised-button [color]="getButtonColor()" (click)="onConfirm()" class="confirm-button">{{ data.confirmText || 'OK' }}</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
      position: relative;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .dialog-header__clean {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      border-bottom: 1px solid #eee;
      background: #fff;
    }

    .dialog-header__clean mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .dialog-header__clean h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
      color: inherit;
    }

    /* Type-specific coloring for icon and title */
    .success.dialog-header__clean { background-color: #2e7d32; color: white; }
    .success.dialog-header__clean mat-icon { color: white; }
    
    .danger.dialog-header__clean { background-color: #c62828; color: white; }
    .danger.dialog-header__clean mat-icon { color: white; }
    
    .warning.dialog-header__clean { background-color: #ef6c00; color: white; }
    .warning.dialog-header__clean mat-icon { color: white; }
    
    .info.dialog-header__clean { background-color: #1565c0; color: white; }
    .info.dialog-header__clean mat-icon { color: white; }

    mat-dialog-content {
      font-size: 1rem;
      color: #333;
      line-height: 1.5;
      margin: 0;
      padding: 24px;
      text-align: left;
    }

    mat-dialog-actions {
      padding: 8px 24px 24px;
      margin: 0;
      gap: 12px;
    }

    .confirm-button {
      min-width: 90px;
      font-weight: 500;
    }

    .cancel-button {
      min-width: 80px;
      color: #757575;
    }
  `]
})
export class MaterialDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MaterialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
      showCancel: boolean;
      confirmText?: string;
      cancelText?: string;
      type?: 'info' | 'success' | 'warning' | 'danger';
    }
  ) { }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  getIcon(): string {
    switch (this.data.type) {
      case 'success': return 'check_circle';
      case 'danger': return 'error';
      case 'warning': return 'warning';
      case 'info':
      default: return 'info';
    }
  }

  getButtonColor(): string {
    switch (this.data.type) {
      case 'success': return 'primary';
      case 'danger': return 'warn';
      case 'warning': return 'accent';
      case 'info':
      default: return 'primary';
    }
  }
}
