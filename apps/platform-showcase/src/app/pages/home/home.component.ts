import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="showcase-page">
      <div class="hero">
        <h1 class="hero-title">UI Platform Component Library</h1>
        <p class="hero-description">
          A comprehensive, accessible, and production-ready Angular component library
        </p>
        <div class="hero-stats">
          <div class="stat">
            <div class="stat-value">8</div>
            <div class="stat-label">Components</div>
          </div>
          <div class="stat">
            <div class="stat-value">3</div>
            <div class="stat-label">Layouts</div>
          </div>
          <div class="stat">
            <div class="stat-value">100%</div>
            <div class="stat-label">Type Safe</div>
          </div>
          <div class="stat">
            <div class="stat-value">WCAG AA</div>
            <div class="stat-label">Accessible</div>
          </div>
        </div>
      </div>

      <div class="components-grid">
        <div class="component-card" *ngFor="let component of components">
          <a [routerLink]="component.path" class="card-link">
            <div class="card-icon">{{ component.icon }}</div>
            <h3 class="card-title">{{ component.name }}</h3>
            <p class="card-description">{{ component.description }}</p>
            <div class="card-features">
              <span class="feature" *ngFor="let feature of component.features">
                {{ feature }}
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .hero {
      text-align: center;
      padding: 60px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 16px;
      margin-bottom: 60px;
    }

    .hero-title {
      font-size: 48px;
      font-weight: 800;
      margin: 0 0 16px 0;
    }

    .hero-description {
      font-size: 20px;
      opacity: 0.95;
      max-width: 600px;
      margin: 0 auto 40px;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 24px;
      max-width: 600px;
      margin: 0 auto;
    }

    .stat {
      background: rgba(255, 255, 255, 0.15);
      padding: 20px;
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 13px;
      opacity: 0.9;
    }

    .components-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .component-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .component-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
      border-color: #3b82f6;
    }

    .card-link {
      display: block;
      padding: 32px;
      text-decoration: none;
      color: inherit;
    }

    .card-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .card-title {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px 0;
    }

    .card-description {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 16px 0;
      line-height: 1.6;
    }

    .card-features {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .feature {
      background: #f3f4f6;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      color: #374151;
      font-weight: 500;
    }
  `]
})
export class HomeComponent {
    components = [
        {
            name: 'Button',
            path: '/button',
            icon: '🔘',
            description: 'Customizable buttons with variants, sizes, and loading states',
            features: ['Loading', 'Variants', 'ARIA']
        },
        {
            name: 'Input',
            path: '/input',
            icon: '📝',
            description: 'Form controls with validation, labels, and prefix/suffix support',
            features: ['Validation', 'Forms', 'Icons']
        },
        {
            name: 'Card',
            path: '/card',
            icon: '📇',
            description: 'Flexible containers with header, content, and footer slots',
            features: ['Slots', 'Hover', 'Padded']
        },
        {
            name: 'Badge & Chip',
            path: '/badge-chip',
            icon: '🏷️',
            description: 'Status indicators and removable tags with multiple variants',
            features: ['Variants', 'Removable', 'Dot']
        },
        {
            name: 'Spinner',
            path: '/spinner',
            icon: '⏳',
            description: 'Loading indicators with multiple variants and overlay mode',
            features: ['3 Variants', 'Overlay', 'Sizes']
        },
        {
            name: 'Modal',
            path: '/modal',
            icon: '📋',
            description: 'Dialog windows with backdrop, escape key, and focus management',
            features: ['Backdrop', 'Keyboard', '4 Sizes']
        },
        {
            name: 'Dropdown',
            path: '/dropdown',
            icon: '📂',
            description: 'Menu component with keyboard navigation and positioning',
            features: ['Keyboard Nav', 'Positions', 'Auto-close']
        },
        {
            name: 'Layouts',
            path: '/layouts',
            icon: '📐',
            description: 'Dashboard, fullscreen, and split-view layout components',
            features: ['Responsive', 'Split Resize', 'Mobile']
        }
    ];
}
