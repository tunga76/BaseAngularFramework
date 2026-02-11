import { Component, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'platform-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="layout-container">
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="collapsed()">
        <div class="sidebar-header">
           <ng-content select="[sidebar-header]"></ng-content>
        </div>
        <div class="sidebar-content">
           <ng-content select="[sidebar-content]"></ng-content>
        </div>
        <div class="sidebar-footer">
           <ng-content select="[sidebar-footer]"></ng-content>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="top-bar">
           <button class="toggle-btn" (click)="toggleSidebar()">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
           </button>
           <ng-content select="[top-bar]"></ng-content>
        </header>
        
        <div class="page-content">
           <router-outlet></router-outlet>
           <ng-content></ng-content>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background-color: var(--color-surface-50);
    }

    .sidebar {
      width: 260px;
      background-color: var(--color-surface-0);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      overflow: hidden;
      white-space: nowrap;
    }

    .sidebar.collapsed {
      width: 64px;
    }

    .sidebar.collapsed .sidebar-header,
    .sidebar.collapsed .sidebar-footer {
      padding: 0 var(--spacing-2);
      justify-content: center;
    }

    .sidebar.collapsed .sidebar-content {
      padding: var(--spacing-2);
    }

    /* Helper to hide text when collapsed */
    .sidebar.collapsed ::ng-deep .hide-on-collapsed {
      display: none;
    }

    .sidebar-header {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 var(--spacing-4);
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
    }

    .sidebar-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: var(--spacing-4);
    }

    .sidebar-footer {
      padding: var(--spacing-4);
      border-top: 1px solid var(--color-border);
      flex-shrink: 0;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .top-bar {
      height: 64px;
      background-color: var(--color-surface-0);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      padding: 0 var(--spacing-4);
      gap: var(--spacing-4);
    }

    .toggle-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--spacing-2);
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
    }
    .toggle-btn:hover {
      background-color: var(--color-surface-100);
      color: var(--color-text-primary);
    }

    .page-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-6);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayoutComponent {
  collapsed = signal(false);

  toggleSidebar() {
    this.collapsed.update(v => !v);
  }
}
