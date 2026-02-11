import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'platform-fullscreen-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="fullscreen-container">
      <router-outlet></router-outlet>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .fullscreen-container {
      min-height: 100vh;
      width: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--color-surface-50);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullscreenLayoutComponent { }
