import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'platform-split-view-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="split-container">
      <div class="sidebar-pane">
        <ng-content select="[sidebar]"></ng-content>
      </div>
      <div class="main-pane">
        <router-outlet></router-outlet>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .split-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .sidebar-pane {
      width: 320px;
      border-right: 1px solid var(--color-border);
      background-color: var(--color-surface-0);
      overflow-y: auto;
    }
    .main-pane {
      flex: 1;
      overflow-y: auto;
      background-color: var(--color-surface-50);
      padding: var(--spacing-6);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplitViewLayoutComponent { }
