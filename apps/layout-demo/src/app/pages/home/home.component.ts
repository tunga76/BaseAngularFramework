import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <header class="home-header">
        <h1>UI Platform Layout Demo</h1>
        <p class="subtitle">Explore layout components from the ui-platform library</p>
      </header>

      <div class="layout-grid">
        <a routerLink="/dashboard-demo" class="layout-card">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          <h2>Dashboard Layout</h2>
          <p>Collapsible sidebar, top bar ve content area ile klasik dashboard layout</p>
          <ul class="feature-list">
            <li>Collapsible sidebar</li>
            <li>Top navigation bar</li>
            <li>Header, content ve footer sections</li>
          </ul>
        </a>

        <a routerLink="/fullscreen-demo" class="layout-card">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </div>
          <h2>Fullscreen Layout</h2>
          <p>Tam ekran içerik için minimal layout - login, landing pages</p>
          <ul class="feature-list">
            <li>Full viewport height</li>
            <li>Sidebar veya header yok</li>
            <li>Merkezi içerik odaklı</li>
          </ul>
        </a>

        <a routerLink="/split-view-demo" class="layout-card">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="3" x2="12" y2="21"></line>
            </svg>
          </div>
          <h2>Split-View Layout</h2>
          <p>Master-detail pattern için yan yana paneller</p>
          <ul class="feature-list">
            <li>Fixed sidebar pane</li>
            <li>Flexible main pane</li>
            <li>Master-detail UX pattern</li>
          </ul>
        </a>

        <a [routerLink]="['/dynamic-layout-demo']" class="layout-card">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              <path d="M12 3v1m0 16v1m8.66-8.66h-1M3.34 12h-1m15.66-4.66l-.7.7M7.05 16.95l-.7.7M16.95 16.95l.7.7M7.05 7.05l.7.7"></path>
            </svg>
          </div>
          <h2>Dynamic Layout</h2>
          <p>Çalışma zamanında dinamik layout değişimi ve registry kullanımı</p>
          <ul class="feature-list">
            <li>Runtime switching</li>
            <li>LayoutRegistry integration</li>
            <li>State persistence</li>
          </ul>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-surface-50) 100%);
      padding: var(--spacing-8);
    }

    .home-header {
      text-align: center;
      margin-bottom: var(--spacing-8);
    }

    .home-header h1 {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-2);
    }

    .subtitle {
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
    }

    .layout-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--spacing-6);
      max-width: 1200px;
      margin: 0 auto;
    }

    .layout-card {
      background-color: var(--color-surface-0);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--spacing-6);
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
    }

    .layout-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      border-color: var(--color-primary-500);
    }

    .card-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--spacing-4);
      color: white;
    }

    .layout-card h2 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-3);
      color: var(--color-text-primary);
    }

    .layout-card p {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-4);
      line-height: var(--line-height-relaxed);
    }

    .feature-list {
      list-style: none;
      margin-top: auto;
    }

    .feature-list li {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      padding: var(--spacing-2) 0;
      border-top: 1px solid var(--color-border);
    }

    .feature-list li:before {
      content: "✓";
      color: var(--color-success-500);
      font-weight: var(--font-weight-bold);
      margin-right: var(--spacing-2);
    }
  `]
})
export class HomeComponent { }
