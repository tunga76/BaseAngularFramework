import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
    LayoutRegistryService,
    DashboardLayoutComponent,
    FullscreenLayoutComponent,
    SplitViewLayoutComponent
} from '@platform/ui-platform';

@Component({
    selector: 'app-dynamic-layout-demo',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        DashboardLayoutComponent,
        FullscreenLayoutComponent,
        SplitViewLayoutComponent
    ],
    template: `
    <!-- Layout Selector UI (Always visible or in top-bar) -->
    <div class="layout-selector-overlay">
      <div class="selector-card">
        <h3>Layout Seçimi</h3>
        <div class="button-group">
          @for (layoutName of layoutRegistry.getRegisteredLayouts(); track layoutName) {
            <button 
              (click)="layoutRegistry.setActiveLayout(layoutName)"
              [class.active]="layoutRegistry.getActiveLayout() === layoutName">
              {{ layoutName | titlecase }}
            </button>
          }
        </div>
        <a [routerLink]="['/home']" class="home-link">Ana Sayfaya Dön</a>
      </div>
    </div>

    <!-- Dynamic Layout Logic -->
    @switch (layoutRegistry.getActiveLayout()) {
      @case ('dashboard') {
        <platform-dashboard-layout>
          <div sidebar-header><h2 class="hide-on-collapsed">Dynamic App</h2></div>
          <div sidebar-content>
            <p class="hide-on-collapsed">Dashboard içeriği burada.</p>
          </div>
          <div top-bar><h1>Dashboard Modu</h1></div>
          <div class="content-box">
            <h3>Dinamik İçerik</h3>
            <p>Şu anda Dashboard layout içindesiniz.</p>
          </div>
        </platform-dashboard-layout>
      }
      @case ('fullscreen') {
        <platform-fullscreen-layout>
          <div class="fullscreen-demo-box">
            <h1>Fullscreen Modu</h1>
            <p>Bu modda bütün ekran kaplanır.</p>
          </div>
        </platform-fullscreen-layout>
      }
      @case ('split-view') {
        <platform-split-view-layout>
          <div sidebar>
            <h3>Master List</h3>
            <p>Dinamik split view.</p>
          </div>
          <div class="content-box">
            <h1>Split-View Modu</h1>
            <p>Yan yana görünüm aktif.</p>
          </div>
        </platform-split-view-layout>
      }
      @default {
        <div class="error-state">
          <h2>Layout yüklenemedi</h2>
          <p>Lütfen bir layout seçin.</p>
        </div>
      }
    }
  `,
    styles: [`
    .layout-selector-overlay {
      position: fixed;
      bottom: var(--spacing-6);
      right: var(--spacing-6);
      z-index: 9999;
    }

    .selector-card {
      background-color: var(--color-surface-0);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--spacing-4);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .selector-card h3 {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .button-group {
      display: flex;
      gap: var(--spacing-2);
    }

    button {
      padding: var(--spacing-2) var(--spacing-4);
      border: 1px solid var(--color-border);
      background-color: var(--color-surface-50);
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: var(--font-size-sm);
      transition: all 0.2s;
    }

    button:hover {
      background-color: var(--color-surface-100);
    }

    button.active {
      background-color: var(--color-primary-500);
      color: white;
      border-color: var(--color-primary-600);
    }

    .home-link {
      font-size: var(--font-size-xs);
      color: var(--color-primary-600);
      text-decoration: none;
      text-align: center;
      margin-top: var(--spacing-1);
    }

    .content-box {
      padding: var(--spacing-6);
    }

    .fullscreen-demo-box {
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-primary-50), var(--color-surface-50));
    }

    .error-state {
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class DynamicLayoutDemoComponent implements OnInit {
    layoutRegistry = inject(LayoutRegistryService);

    ngOnInit() {
        console.log('DynamicLayoutDemoComponent initialized');
        // Layoutları kaydet
        if (!this.layoutRegistry.hasLayout('dashboard')) {
            console.log('Registering dashboard layout');
            this.layoutRegistry.registerLayout('dashboard', DashboardLayoutComponent);
        }
        if (!this.layoutRegistry.hasLayout('fullscreen')) {
            console.log('Registering fullscreen layout');
            this.layoutRegistry.registerLayout('fullscreen', FullscreenLayoutComponent);
        }
        if (!this.layoutRegistry.hasLayout('split-view')) {
            console.log('Registering split-view layout');
            this.layoutRegistry.registerLayout('split-view', SplitViewLayoutComponent);
        }

        // Varsayılan layoutu ayarla
        this.layoutRegistry.setActiveLayout('dashboard');
        console.log('Active layouts:', this.layoutRegistry.getRegisteredLayouts());
    }
}
