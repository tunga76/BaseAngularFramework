import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'platform-dashboard-layout',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard-container">
      <aside class="sidebar">
        <div class="sidebar-header">
          <ng-content select="[sidebar-header]"></ng-content>
        </div>
        <nav class="sidebar-nav">
          <ng-content select="[sidebar-nav]"></ng-content>
        </nav>
      </aside>
      <main class="main-content">
        <header class="top-bar">
          <ng-content select="[top-bar]"></ng-content>
        </header>
        <div class="content-area">
          <ng-content></ng-content>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .dashboard-container {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background-color: var(--color-background);
      color: var(--color-text);
    }

    .sidebar {
      width: 260px;
      background-color: var(--color-surface);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: var(--transition-md);
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .top-bar {
      height: 64px;
      background-color: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      padding: 0 var(--spacing-lg);
      flex-shrink: 0;
    }

    .content-area {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-lg);
    }

    @media (max-width: 768px) {
      .sidebar {
        display: none; /* In a real app, we'd add a toggleable drawer */
      }
    }
  `]
})
export class DashboardLayoutComponent { }
