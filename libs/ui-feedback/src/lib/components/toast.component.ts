import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'platform-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      <div class="toast" [class]="type">
        <div class="toast-content">
          <span class="message">{{ message }}</span>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 10000;
      pointer-events: none;
    }
    .toast {
      min-width: 250px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      background: #333;
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-top: 0.5rem;
      pointer-events: auto;
      animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      align-items: center;
    }
    .toast.success { background: #198754; }
    .toast.error { background: #dc3545; }
    .toast.info { background: #0d6efd; }
    .toast.warning { background: #ffc107; color: black; }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
    @Input() message = '';
    @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
}
