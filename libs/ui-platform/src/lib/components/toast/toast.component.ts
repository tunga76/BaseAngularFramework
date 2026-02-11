import { Component, Injectable, signal, computed, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toasts = signal<Toast[]>([]);

    readonly activeToasts = this.toasts.asReadonly();

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: Toast = { id, message, type, duration };

        this.toasts.update(current => [...current, toast]);

        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
    }

    remove(id: string) {
        this.toasts.update(current => current.filter(t => t.id !== id));
    }
}

@Component({
    selector: 'platform-toast-item',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast" [class]="'toast-' + toast.type">
      <span>{{ toast.message }}</span>
      <button class="close-btn" (click)="close()">×</button>
    </div>
  `,
    styles: [`
    .toast {
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-md);
      background: white;
      box-shadow: var(--shadow-lg);
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      min-width: 300px;
      animation: slideIn 0.3s ease;
      color: var(--color-text-primary);
      border-left: 4px solid transparent;
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .toast-success { border-left-color: var(--color-success); }
    .toast-error { border-left-color: var(--color-error); }
    .toast-info { border-left-color: var(--color-info); }
    .toast-warning { border-left-color: var(--color-warning); }

    .close-btn {
      margin-left: auto;
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: var(--color-text-secondary);
      line-height: 1;
    }
    .close-btn:hover { color: var(--color-text-primary); }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastItemComponent {
    @Input({ required: true }) toast!: Toast;

    constructor(private toastService: ToastService) { }

    close() {
        this.toastService.remove(this.toast.id);
    }
}

@Component({
    selector: 'platform-toast-container',
    standalone: true,
    imports: [CommonModule, ToastItemComponent],
    template: `
    <div class="toast-container">
      <platform-toast-item *ngFor="let toast of toastService.activeToasts()" [toast]="toast"></platform-toast-item>
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: var(--spacing-4);
      right: var(--spacing-4);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
      pointer-events: none;
    }
    .toast-container > * {
      pointer-events: auto;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainerComponent {
    constructor(public toastService: ToastService) { }
}
