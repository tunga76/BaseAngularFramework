import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'platform-fullscreen-layout',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fullscreen-container">
      <ng-content></ng-content>
    </div>
  `,
    styles: [`
    .fullscreen-container {
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      background-color: var(--color-background);
      color: var(--color-text);
    }
  `]
})
export class FullScreenLayoutComponent { }
