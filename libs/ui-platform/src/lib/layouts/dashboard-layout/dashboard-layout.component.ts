import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Dashboard layout component with sidebar, top bar, and main content area.
 * 
 * Provides a responsive layout structure commonly used in admin dashboards.
 * The sidebar can be toggled on mobile devices for better UX.
 * 
 * Accessibility features:
 * - ARIA landmarks (navigation, main)
 * - Skip to main content link
 * - Keyboard navigation support
 * - Mobile-friendly drawer
 * 
 * @example
 * ```html
 * <platform-dashboard-layout>
 *   <!-- Sidebar header -->
 *   <div sidebar-header>
 *     <h1>My App</h1>
 *   </div>
 *   
 *   <!-- Sidebar navigation -->
 *   <nav sidebar-nav>
 *     <a routerLink="/dashboard">Dashboard</a>
 *     <a routerLink="/settings">Settings</a>
 *   </nav>
 *   
 *   <!-- Top bar -->
 *   <div top-bar>
 *     <button>Notifications</button>
 *   </div>
 *   
 *   <!-- Main content (default slot) -->
 *   <router-outlet></router-outlet>
 * </platform-dashboard-layout>
 * ```
 */
@Component({
  selector: 'platform-dashboard-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <!-- Skip to main content link for keyboard users -->
      <a href="#main-content" class="skip-link">Skip to main content</a>
      
      <!-- Backdrop for mobile drawer -->
      <div *ngIf="sidebarOpen() && isMobile" 
           class="backdrop" 
           (click)="closeSidebar()"
           aria-hidden="true"></div>
      
      <aside class="sidebar" 
             role="navigation" 
             aria-label="Main navigation"
             [class.open]="sidebarOpen()"
             [attr.aria-hidden]="!sidebarOpen() && isMobile">
        <div class="sidebar-header">
          <ng-content select="[sidebar-header]"></ng-content>
        </div>
        <nav class="sidebar-nav">
          <ng-content select="[sidebar-nav]"></ng-content>
        </nav>
      </aside>
      
      <main class="main-content" role="main">
        <header class="top-bar">
          <!-- Mobile menu toggle -->
          <button *ngIf="isMobile" 
                  class="menu-toggle"
                  (click)="toggleSidebar()"
                  aria-label="Toggle navigation menu"
                  [attr.aria-expanded]="sidebarOpen()">
            <span class="hamburger"></span>
          </button>
          
          <ng-content select="[top-bar]"></ng-content>
        </header>
        <div class="content-area" id="main-content" tabindex="-1">
          <ng-content></ng-content>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      height: 100%;
      width: 100%;
      overflow: hidden;
      background-color: var(--color-background, #ffffff);
      color: var(--color-text, #111827);
      position: relative;
    }

    /* Skip link for accessibility */
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background-color: var(--color-primary, #3b82f6);
      color: white;
      padding: 8px 16px;
      text-decoration: none;
      z-index: 100;
      border-radius: 0 0 4px 0;
    }

    .skip-link:focus {
      top: 0;
    }

    /* Backdrop for mobile */
    .backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 40;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .sidebar {
      width: 260px;
      background-color: var(--color-surface, #f9fafb);
      border-right: 1px solid var(--color-border, #e5e7eb);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: transform var(--transition-md, 0.3s ease);
      z-index: 50;
    }

    .sidebar-header {
      padding: var(--spacing-lg, 16px);
      border-bottom: 1px solid var(--color-border, #e5e7eb);
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-md, 12px);
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .top-bar {
      height: 64px;
      background-color: var(--color-surface, #f9fafb);
      border-bottom: 1px solid var(--color-border, #e5e7eb);
      display: flex;
      align-items: center;
      padding: 0 var(--spacing-lg, 16px);
      flex-shrink: 0;
      gap: 12px;
    }

    .menu-toggle {
      display: none;
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      width: 40px;
      height: 40px;
      position: relative;
      border-radius: var(--radius-md, 6px);
    }

    .menu-toggle:hover {
      background-color: var(--color-background, #f3f4f6);
    }

    .menu-toggle:focus-visible {
      outline: 2px solid var(--color-primary, #3b82f6);
      outline-offset: 2px;
    }

    .hamburger {
      display: block;
      width: 24px;
      height: 2px;
      background-color: currentColor;
      position: relative;
    }

    .hamburger::before,
    .hamburger::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 2px;
      background-color: currentColor;
      left: 0;
      transition: transform 0.2s ease;
    }

    .hamburger::before {
      top: -8px;
    }

    .hamburger::after {
      top: 8px;
    }

    .content-area {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-lg, 16px);
    }

    .content-area:focus {
      outline: none;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        transform: translateX(-100%);
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .menu-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
  `]
})
export class DashboardLayoutComponent {
  /** Whether sidebar is open (reactive signal) */
  sidebarOpen = signal(true);

  /** Whether the viewport is mobile size */
  isMobile = false;

  constructor() {
    this.checkMobile();
  }

  /**
   * Toggles the sidebar open/closed state.
   */
  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  /**
   * Closes the sidebar (used on mobile when clicking backdrop).
   */
  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  /**
   * Checks if the viewport is mobile size.
   */
  @HostListener('window:resize')
  checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;

    // Auto-close sidebar on mobile, auto-open on desktop
    if (this.isMobile) {
      this.sidebarOpen.set(false);
    } else {
      this.sidebarOpen.set(true);
    }
  }

  /**
   * Closes sidebar when Escape key is pressed (mobile only).
   */
  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.isMobile && this.sidebarOpen()) {
      this.closeSidebar();
    }
  }
}
