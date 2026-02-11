import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalLoadingService } from '../../services/global-loading.service';

@Component({
    selector: 'platform-loading-bar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="loading-bar-container" *ngIf="loadingService.isLoading()">
      <div class="loading-bar"></div>
    </div>
  `,
    styles: [`
    .loading-bar-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      z-index: 9999;
      background-color: var(--color-surface-100);
      overflow: hidden;
    }

    .loading-bar {
      height: 100%;
      background-color: var(--color-primary);
      width: 100%;
      transform-origin: left;
      animation: indeterminate 1s infinite linear;
    }

    @keyframes indeterminate {
      0% {
        transform: translateX(0) scaleX(0);
      }
      40% {
        transform: translateX(0) scaleX(0.4);
      }
      100% {
        transform: translateX(100%) scaleX(0.5);
      }
    }
  `]
})
export class LoadingBarComponent {
    loadingService = inject(GlobalLoadingService);
}
