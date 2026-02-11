import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    template: `
    <div class="layout">
      <header>
        <h1>Core Library Showcase</h1>
        <nav>
          <a routerLink="/logger" routerLinkActive="active">Logger</a>
          <a routerLink="/storage" routerLinkActive="active">Storage</a>
          <a routerLink="/api" routerLinkActive="active">API Client</a>
          <a routerLink="/inactivity" routerLinkActive="active">Inactivity</a>
        </nav>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
    styles: [`
    .layout {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      border-bottom: 1px solid #ddd;
      margin-bottom: 20px;
      padding-bottom: 20px;
    }
    h1 { margin: 0 0 16px 0; color: #333; }
    nav { display: flex; gap: 16px; }
    nav a {
      text-decoration: none;
      color: #666;
      padding: 8px 16px;
      border-radius: 4px;
      background: #f5f5f5;
      font-weight: 500;
    }
    nav a.active {
      background: #333;
      color: white;
    }
    nav a:hover:not(.active) {
      background: #e0e0e0;
    }
    main {
        min-height: 400px;
    }
  `]
})
export class AppComponent { }
