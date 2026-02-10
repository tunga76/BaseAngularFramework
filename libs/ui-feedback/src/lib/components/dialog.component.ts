import { Component, Input, Output, EventEmitter, inject, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { UiSanitizerService } from '../security/ui-sanitizer.service';

@Component({
  selector: 'platform-dialog',
  standalone: true,
  imports: [CommonModule, A11yModule],
  template: `
    <div class="overlay" 
         role="dialog"
         aria-modal="true"
         [attr.aria-labelledby]="'dialog-title-' + _dialogId"
         [attr.aria-describedby]="'dialog-message-' + _dialogId"
         (click)="onBackdropClick()"
         (keydown.escape)="onEscape()"
         cdkTrapFocus
         [cdkTrapFocusAutoCapture]="true">
      <div class="dialog-card" [class]="type" (click)="$event.stopPropagation()">
        <div class="header">
          <h3 [id]="'dialog-title-' + _dialogId">{{ title }}</h3>
          <button class="close-btn" 
                  (click)="onClose()" 
                  [attr.aria-label]="'Close ' + title"
                  type="button">×</button>
        </div>
        <div class="body">
          <p [id]="'dialog-message-' + _dialogId" 
             [innerHTML]="safeMessage"></p>
        </div>
        <div class="footer">
          <button *ngIf="showCancel" 
                  class="btn btn-secondary" 
                  (click)="onCancel()"
                  type="button"
                  [attr.aria-label]="cancelText">{{ cancelText }}</button>
          <button class="btn" 
                  [class]="'btn-' + type" 
                  (click)="onConfirm()"
                  type="button"
                  [attr.aria-label]="confirmText"
                  cdkFocusInitial>{{ confirmText }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease-out;
    }
    .dialog-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      width: 90%;
      max-width: 450px;
      overflow: hidden;
      animation: slideUp 0.3s ease-out;
    }
    .header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h3 { margin: 0; font-size: 1.25rem; }
    .close-btn { 
      background: none; 
      border: none; 
      font-size: 1.5rem; 
      cursor: pointer; 
      color: #999;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close-btn:hover { color: #666; }
    .close-btn:focus-visible {
      outline: 2px solid #0d6efd;
      outline-offset: 2px;
      border-radius: 4px;
    }
    .body { padding: 1.5rem; font-size: 1rem; color: #444; }
    .footer { padding: 1rem 1.5rem; background: #f8f9fa; display: flex; justify-content: flex-end; gap: 0.75rem; }
    
    .btn { 
      padding: 0.5rem 1.25rem; 
      border-radius: 6px; 
      font-weight: 600; 
      cursor: pointer; 
      border: none; 
      transition: all 0.2s;
    }
    .btn:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
    .btn-secondary { background: #e9ecef; color: #495057; }
    .btn-secondary:hover { background: #dee2e6; }
    
    .btn-info { background: #0d6efd; color: white; }
    .btn-info:hover { background: #0b5ed7; }
    
    .btn-warning { background: #ffc107; color: #000; }
    .btn-warning:hover { background: #ffca2c; }
    
    .btn-danger { background: #dc3545; color: white; }
    .btn-danger:hover { background: #bb2d3b; }

    .btn-success { background: #198754; color: white; }
    .btn-success:hover { background: #157347; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class DialogComponent implements OnInit {
  @Input() title = 'Message';
  @Input() message = '';
  @Input() type: 'info' | 'warning' | 'danger' | 'success' = 'info';
  @Input() confirmText = 'OK';
  @Input() cancelText = 'Cancel';
  @Input() showCancel = false;
  @Input() allowHtml = false;
  @Input() disableBackdropClick = false;

  @Output() confirmed = new EventEmitter<boolean>();

  safeMessage = '';
  _dialogId = Math.random().toString(36).substring(2, 9);

  private sanitizer = inject(UiSanitizerService);
  private elementRef = inject(ElementRef);

  ngOnInit(): void {
    // Sanitize message for XSS protection
    this.safeMessage = this.sanitizer.sanitize(this.message, this.allowHtml);
  }

  onConfirm(): void {
    this.confirmed.emit(true);
  }

  onCancel(): void {
    this.confirmed.emit(false);
  }

  onClose(): void {
    this.confirmed.emit(false);
  }

  onEscape(): void {
    this.confirmed.emit(false);
  }

  onBackdropClick(): void {
    if (!this.disableBackdropClick) {
      this.confirmed.emit(false);
    }
  }
}
