import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardLayoutComponent } from '@platform/ui-platform';

@Component({
  selector: 'app-dashboard-demo',
  imports: [CommonModule, RouterLink, DashboardLayoutComponent],
  template: `
    <platform-dashboard-layout>
      <!-- Sidebar Header -->
      <div sidebar-header class="sidebar-brand">
        <h2 class="hide-on-collapsed">Dashboard</h2>
        <div class="logo-icon hide-on-expanded">D</div>
      </div>

      <!-- Sidebar Content -->
      <nav sidebar-content class="sidebar-nav">
        <a routerLink="/" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
          <span class="hide-on-collapsed">Ana Sayfa</span>
        </a>
        <a class="nav-item active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span class="hide-on-collapsed">Dashboard</span>
        </a>
        <a class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <path d="M20 8v6M23 11h-6"></path>
          </svg>
          <span class="hide-on-collapsed">Kullanıcılar</span>
        </a>
        <a class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
          <span class="hide-on-collapsed">Ayarlar</span>
        </a>
      </nav>

      <!-- Sidebar Footer -->
      <div sidebar-footer class="sidebar-user">
        <div class="user-avatar">👤</div>
        <div class="user-info hide-on-collapsed">
          <div class="user-name">Admin User</div>
          <div class="user-role">Administrator</div>
        </div>
      </div>

      <!-- Top Bar -->
      <div top-bar class="top-bar-content">
        <h1>Dashboard Overview</h1>
        <div class="top-bar-actions">
          <button class="icon-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="dashboard-content">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background: var(--color-primary-100); color: var(--color-primary-600);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <path d="M20 8v6M23 11h-6"></path>
              </svg>
            </div>
            <div class="stat-value">2,543</div>
            <div class="stat-label">Toplam Kullanıcı</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background: var(--color-success-100); color: var(--color-success-600);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div class="stat-value">98.5%</div>
            <div class="stat-label">Uptime</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background: var(--color-warning-100); color: var(--color-warning-600);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div class="stat-value">$12,450</div>
            <div class="stat-label">Gelir (Aylık)</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background: var(--color-info-100); color: var(--color-info-600);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div class="stat-value">156</div>
            <div class="stat-label">Aktif Projeler</div>
          </div>
        </div>

        <div class="content-section">
          <h2>Layout Özellikleri</h2>
          <p>Bu dashboard layout aşağıdaki özellikleri içerir:</p>
          <ul>
            <li><strong>Collapsible Sidebar:</strong> Sol üst köşedeki hamburger menü ile sidebar'ı daraltıp genişletebilirsiniz</li>
            <li><strong>Sidebar Sections:</strong> Header, content ve footer bölümlerine ayrılmış sidebar</li>
            <li><strong>Top Navigation Bar:</strong> Sayfa başlığı ve aksiyonlar için üst bar</li>
            <li><strong>Scrollable Content:</strong> Ana içerik alanı bağımsız scroll özelliğine sahip</li>
            <li><strong>Responsive Design:</strong> Tüm ekran boyutlarına uyumlu</li>
          </ul>
        </div>
      </div>
    </platform-dashboard-layout>
  `,
  styles: [`
    .sidebar-brand {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: white; /* Dark sidebar text */
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600));
      color: white;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-2xl);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .hide-on-expanded {
      display: none;
    }

    /* Style when layout is collapsed */
    :host ::ng-deep platform-dashboard-layout .sidebar.collapsed .hide-on-expanded {
      display: flex;
    }

    /* Modern Dark Sidebar Overrides */
    :host ::ng-deep platform-dashboard-layout .sidebar {
      background-color: #111827; /* Gray 900 */
      border-right: none;
    }

    :host ::ng-deep platform-dashboard-layout .sidebar-header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      margin-bottom: var(--spacing-4);
    }

    :host ::ng-deep platform-dashboard-layout .sidebar-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.03);
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
      padding: var(--spacing-4) var(--spacing-3);
    }

    .nav-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-lg);
      color: #94a3b8; /* Slate 400 */
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 0;
      font-weight: 500;
      font-size: var(--font-size-sm);
      border: 1px solid transparent;
      background-color: transparent;
    }

    .nav-item svg {
      flex-shrink: 0;
      transition: all 0.2s ease;
      color: #64748b; /* Slate 500 */
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: white;
      border-color: rgba(255, 255, 255, 0.1);
    }

    .nav-item:hover svg {
      color: white;
      transform: scale(1.1);
    }

    .nav-item.active {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05));
      color: white;
      border-color: rgba(99, 102, 241, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .nav-item.active svg {
      color: #818cf8; /* Indigo 400 */
    }

    /* Refined active indicator */
    .nav-item.active::before {
      content: "";
      position: absolute;
      left: 0;
      top: 25%;
      height: 50%;
      width: 3px;
      background-color: #818cf8;
      border-radius: 0 2px 2px 0;
      box-shadow: 0 0 8px rgba(129, 140, 248, 0.6);
    }

    :host ::ng-deep platform-dashboard-layout .sidebar.collapsed .nav-item {
      justify-content: center;
      padding: var(--spacing-3) 0;
      width: 44px;
      margin: 0 auto;
    }

    :host ::ng-deep platform-dashboard-layout .sidebar.collapsed .nav-item.active::before {
      display: none;
    }

    .sidebar-user {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, #334155, #1e293b);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xl);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .user-info {
      flex: 1;
    }

    .user-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: white;
    }

    .user-role {
      font-size: var(--font-size-xs);
      color: #94a3b8; /* Slate 400 */
    }

    :host ::ng-deep platform-dashboard-layout .main-content {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    }

    :host ::ng-deep platform-dashboard-layout .top-bar {
      background-color: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid #e2e8f0;
    }

    .top-bar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;
    }

    .top-bar-content h1 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: #1e293b;
    }

    .top-bar-actions {
      display: flex;
      gap: var(--spacing-2);
    }

    .icon-button {
      width: 36px;
      height: 36px;
      border: 1px solid #e2e8f0;
      background-color: white;
      border-radius: var(--radius-md);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      transition: all 0.2s;
    }

    .icon-button:hover {
      background-color: #f8fafc;
      color: var(--color-primary-600);
      border-color: var(--color-primary-200);
    }

    .dashboard-content {
      padding: var(--spacing-6);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-8);
    }

    .stat-card {
      background-color: white;
      border: 1px solid #f1f5f9;
      border-radius: var(--radius-xl);
      padding: var(--spacing-6);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.05);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--spacing-4);
    }

    .stat-value {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: #0f172a;
      margin-bottom: var(--spacing-1);
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: #64748b;
      font-weight: var(--font-weight-medium);
    }

    .content-section {
      background-color: white;
      border: 1px solid #f1f5f9;
      border-radius: var(--radius-2xl);
      padding: var(--spacing-8);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .content-section h2 {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--spacing-6);
      color: #0f172a;
    }

    .content-section p {
      color: #475569;
      margin-bottom: var(--spacing-6);
      line-height: var(--line-height-relaxed);
    }

    .content-section ul {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-4);
      list-style: none;
      padding: 0;
    }

    .content-section li {
      padding: var(--spacing-4);
      border: 1px solid #f1f5f9;
      background-color: #f8fafc;
      margin-bottom: 0;
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .content-section li:before {
      content: "✓";
      color: var(--color-success-500);
      font-weight: bold;
      margin-right: var(--spacing-2);
      display: none; /* remove default dot */
    }

    .content-section strong {
      color: #0f172a;
      font-size: var(--font-size-lg);
    }
  `]
})
export class DashboardDemoComponent { }
