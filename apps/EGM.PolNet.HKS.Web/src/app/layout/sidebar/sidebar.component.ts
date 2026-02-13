import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar-wrapper">
      <div class="sidebar-header">
        <div class="logo-section" *ngIf="!collapsed()">
          <span class="logo-text">PolNet<span class="highlight">HKS</span></span>
        </div>
        <button class="sidebar-toggle" (click)="toggle.emit()" aria-label="Menüyü Kapat">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      <nav class="nav-menu">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span class="label" *ngIf="!collapsed()">Panel</span>
        </a>
        <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span class="label" *ngIf="!collapsed()">Kullanıcılar</span>
        </a>
        <a routerLink="/admin/giris-cikis" routerLinkActive="active" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          <span class="label" *ngIf="!collapsed()">Giriş-Çıkış</span>
        </a>
        <a routerLink="/reports" routerLinkActive="active" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
          <span class="label" *ngIf="!collapsed()">Raporlar</span>
        </a>
      </nav>

      <div class="sidebar-bottom" *ngIf="!collapsed()">
        <div class="version">v1.0.0</div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: #0f172a; /* Slate-900 */
      color: #f8fafc; /* Slate-50 */
    }
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-4);
      min-height: 64px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .logo-section {
      text-align: left;
      font-size: 1.25rem;
      font-weight: 800;
      color: #38bdf8; /* Sky-400 */
    }
    .sidebar-toggle {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-1);
      color: #94a3b8; /* Slate-400 */
      transition: all 0.2s;
    }
    .sidebar-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
    .highlight {
      color: white;
    }
    .nav-menu {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
      padding: var(--spacing-3);
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-md);
      color: #94a3b8; /* Slate-400 */
      text-decoration: none;
      transition: all 0.2s;
    }
    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: white;
    }
    .nav-item.active {
      background-color: #0ea5e9; /* Sky-500 */
      color: white;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
    }
    .sidebar-bottom {
      padding: var(--spacing-4);
      font-size: 0.75rem;
      color: #475569; /* Slate-500 */
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  collapsed = input<boolean>(false);
  toggle = output<void>();
}
