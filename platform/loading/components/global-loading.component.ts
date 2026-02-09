import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../services/loading.service';

@Component({
    selector: 'app-global-loading',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="isLoading$ | async" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  `,
    styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--overlay-bg);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: var(--z-loading);
      backdrop-filter: blur(2px);
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid var(--surface-bg);
      border-top: 4px solid var(--color-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class GlobalLoadingComponent {
    isLoading$ = this.loadingService.isLoading$;

    constructor(private loadingService: LoadingService) { }
}
