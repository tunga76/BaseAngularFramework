import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent, SplitViewLayoutComponent, ButtonComponent } from '@platform/ui-platform';

@Component({
  selector: 'app-layouts-showcase',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent, SplitViewLayoutComponent, ButtonComponent],
  template: `
    <div class="showcase-page">
      <div class="page-header">
        <h1 class="page-title">Layout Components</h1>
        <p class="page-description">Responsive layout components with built-in mobile support</p>
      </div>

      <div class="layout-demos">
        <!-- Dashboard Layout Demo -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Dashboard Layout</h2>
            <p class="section-desc">Responsive dashboard with collapsible sidebar and mobile drawer support.</p>
          </div>
          
          <div class="demo-wrapper">
            <div class="demo-controls">
              <span class="badge">Try resizing the window!</span>
            </div>
            <div class="demo-container dashboard-demo">
              <platform-dashboard-layout>
                <div sidebar-header class="demo-sidebar-header">
                  <div class="logo">📱</div>
                  <h3>App</h3>
                </div>
                
                <nav sidebar-content class="demo-nav">
                  <a href="javascript:void(0)" class="nav-item active">
                    <span>📊</span> Dashboard
                  </a>
                  <a href="javascript:void(0)" class="nav-item">
                    <span>👥</span> Users
                  </a>
                  <a href="javascript:void(0)" class="nav-item">
                    <span>⚙️</span> Settings
                  </a>
                </nav>
                
                <div top-bar class="demo-topbar">
                  <div class="search-bar">🔍 Search...</div>
                  <div class="user-profile">👤</div>
                </div>
                
                <div class="demo-content">
                  <div class="content-card">
                    <h3>Responsive Content</h3>
                    <p>The sidebar converts to a drawer on mobile screens.</p>
                  </div>
                  <div class="grid-preview">
                    <div class="grid-item">Widget 1</div>
                    <div class="grid-item">Widget 2</div>
                    <div class="grid-item">Widget 3</div>
                  </div>
                </div>
              </platform-dashboard-layout>
            </div>
          </div>
        </div>

        <!-- Split View Demo -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Split View Layout</h2>
            <p class="section-desc">Resizable split panes with configurable constraints.</p>
          </div>

          <div class="demo-wrapper">
            <div class="demo-controls">
              <!-- Controls not supported yet -->
            </div>
            <div class="demo-container split-demo">
              <platform-split-view-layout>
                <div left-pane class="pane pane-1">
                  <h3>Pane 1</h3>
                  <p>Resizable area</p>
                  <p class="hint">Drag the divider</p>
                </div>
                <div right-pane class="pane pane-2">
                  <h3>Pane 2</h3>
                  <p>Flexible content area</p>
                  <div class="fake-content"></div>
                  <div class="fake-content"></div>
                </div>
              </platform-split-view-layout>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .layout-demos {
      display: flex;
      flex-direction: column;
      gap: 48px;
    }

    .section-header {
      margin-bottom: 16px;
    }

    .section-desc {
      color: #6b7280;
      margin: 8px 0 0;
    }

    .demo-wrapper {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .demo-controls {
      padding: 12px 16px;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .badge {
      font-size: 12px;
      background: #e0f2fe;
      color: #0369a1;
      padding: 4px 8px;
      border-radius: 99px;
      font-weight: 500;
    }

    /* Dashboard Demo Styles */
    .dashboard-demo {
      height: 600px;
      position: relative;
      /* Isolate creating a new stacking context for contained fixed elements */
      transform: translate(0); 
    }

    .demo-sidebar-header {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #1e293b;
      color: white;
    }

    .demo-sidebar-header h3 { margin: 0; }

    .demo-nav {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      color: #cbd5e1;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .nav-item:hover, .nav-item.active {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .demo-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 8px; /* Platform component adds padding, we adjust inner */
    }

    .demo-content {
      padding: 24px;
      height: 100%;
      overflow-y: auto;
      background: #f1f5f9;
    }

    .content-card {
      background: white;
      padding: 24px;
      border-radius: 8px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .grid-preview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .grid-item {
      height: 120px;
      background: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      border: 2px dashed #e2e8f0;
    }

    /* Split View Demo Styles */
    .split-demo {
      height: 500px;
      background: white;
    }

    .pane {
      height: 100%;
      padding: 24px;
      overflow-y: auto;
    }

    .pane-1 {
      background: #f8fafc;
    }

    .pane-2 {
      background: white;
    }

    .hint {
      font-size: 13px;
      color: #64748b;
      font-style: italic;
    }

    .fake-content {
      height: 120px;
      background: #f1f5f9;
      border-radius: 6px;
      margin-top: 16px;
    }

    /* Mobile Responsive Adjustments */
    @media (max-width: 640px) {
      .showcase-page {
        padding: 16px;
      }

      .dashboard-demo {
        height: 500px;
      }

      .split-demo {
        height: 400px;
      }
    }
  `]
})
export class LayoutsShowcaseComponent { }
