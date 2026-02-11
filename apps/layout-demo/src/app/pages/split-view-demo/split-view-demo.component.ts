import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SplitViewLayoutComponent } from '@platform/ui-platform';

interface ListItem {
    id: number;
    title: string;
    description: string;
    category: string;
}

@Component({
    selector: 'app-split-view-demo',
    imports: [CommonModule, RouterLink, SplitViewLayoutComponent],
    template: `
    <platform-split-view-layout>
      <!-- Sidebar (Master) -->
      <div sidebar class="sidebar-panel">
        <div class="panel-header">
          <a routerLink="/" class="back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </a>
          <h2>Split-View Layout</h2>
        </div>

        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" placeholder="Ara..." />
        </div>

        <div class="item-list">
          @for (item of items(); track item.id) {
            <div 
              class="list-item" 
              [class.active]="selectedItem()?.id === item.id"
              (click)="selectItem(item)">
              <div class="item-category">{{ item.category }}</div>
              <div class="item-title">{{ item.title }}</div>
              <div class="item-description">{{ item.description }}</div>
            </div>
          }
        </div>
      </div>

      <!-- Main Content (Detail) -->
      <div class="detail-panel">
        @if (selectedItem(); as item) {
          <div class="detail-content">
            <div class="detail-header">
              <span class="category-badge">{{ item.category }}</span>
              <h1>{{ item.title }}</h1>
            </div>

            <div class="detail-body">
              <p class="lead">{{ item.description }}</p>

              <div class="info-section">
                <h3>Detaylı Bilgi</h3>
                <p>Bu bir master-detail pattern örneğidir. Sol panelde listeden bir item seçtiğinizde, sağ panelde detayları görüntülenir.</p>
              </div>

              <div class="info-section">
                <h3>Layout Özellikleri</h3>
                <ul>
                  <li><strong>Fixed Sidebar:</strong> Sol panel sabit genişlikte (320px)</li>
                  <li><strong>Flexible Main Pane:</strong> Sağ panel kalan alanı kaplar</li>
                  <li><strong>Independent Scrolling:</strong> Her panel bağımsız scroll özelliğine sahip</li>
                  <li><strong>Master-Detail Pattern:</strong> Liste ve detay görünümü için ideal</li>
                </ul>
              </div>

              <div class="info-section">
                <h3>Kullanım Alanları</h3>
                <div class="use-case-grid">
                  <div class="use-case-card">
                    <div class="use-case-icon">📧</div>
                    <div class="use-case-title">E-posta İstemcileri</div>
                  </div>
                  <div class="use-case-card">
                    <div class="use-case-icon">📁</div>
                    <div class="use-case-title">Dosya Yöneticileri</div>
                  </div>
                  <div class="use-case-card">
                    <div class="use-case-icon">👥</div>
                    <div class="use-case-title">Kullanıcı Listeleri</div>
                  </div>
                  <div class="use-case-card">
                    <div class="use-case-icon">📝</div>
                    <div class="use-case-title">Not Uygulamaları</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="3" x2="12" y2="21"></line>
            </svg>
            <h2>Bir item seçin</h2>
            <p>Sol panelden bir item seçtiğinizde detayları burada görüntülenecektir</p>
          </div>
        }
      </div>
    </platform-split-view-layout>
  `,
    styles: [`
    .sidebar-panel {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--color-surface-0);
    }

    .panel-header {
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .back-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: all 0.2s;
    }

    .back-btn:hover {
      background-color: var(--color-surface-100);
      color: var(--color-text-primary);
    }

    .panel-header h2 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      flex: 1;
    }

    .search-box {
      padding: var(--spacing-4);
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      border-bottom: 1px solid var(--color-border);
      color: var(--color-text-secondary);
    }

    .search-box input {
      flex: 1;
      border: none;
      outline: none;
      font-size: var(--font-size-base);
      background: transparent;
      color: var(--color-text-primary);
    }

    .item-list {
      flex: 1;
      overflow-y: auto;
    }

    .list-item {
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--color-border);
      cursor: pointer;
      transition: all 0.2s;
    }

    .list-item:hover {
      background-color: var(--color-surface-50);
    }

    .list-item.active {
      background-color: var(--color-primary-50);
      border-left: 3px solid var(--color-primary-500);
    }

    .item-category {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-primary-600);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: var(--spacing-1);
    }

    .item-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-1);
    }

    .item-description {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .detail-panel {
      background-color: var(--color-surface-50);
    }

    .detail-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .detail-header {
      margin-bottom: var(--spacing-6);
    }

    .category-badge {
      display: inline-block;
      padding: var(--spacing-1) var(--spacing-3);
      background-color: var(--color-primary-100);
      color: var(--color-primary-700);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: var(--spacing-3);
    }

    .detail-header h1 {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
    }

    .detail-body {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }

    .lead {
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
      line-height: var(--line-height-relaxed);
    }

    .info-section {
      background-color: var(--color-surface-0);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--spacing-6);
    }

    .info-section h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-4);
    }

    .info-section p {
      color: var(--color-text-secondary);
      line-height: var(--line-height-relaxed);
    }

    .info-section ul {
      list-style: none;
      padding: 0;
    }

    .info-section li {
      padding: var(--spacing-3);
      border-left: 3px solid var(--color-primary-500);
      background-color: var(--color-surface-50);
      margin-bottom: var(--spacing-3);
      border-radius: var(--radius-sm);
    }

    .info-section strong {
      color: var(--color-text-primary);
    }

    .use-case-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-4);
    }

    .use-case-card {
      text-align: center;
      padding: var(--spacing-4);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      transition: all 0.2s;
    }

    .use-case-card:hover {
      border-color: var(--color-primary-500);
      transform: translateY(-2px);
    }

    .use-case-icon {
      font-size: 2rem;
      margin-bottom: var(--spacing-2);
    }

    .use-case-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      color: var(--color-text-secondary);
      padding: var(--spacing-8);
    }

    .empty-state svg {
      margin-bottom: var(--spacing-4);
      opacity: 0.5;
    }

    .empty-state h2 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-2);
    }

    .empty-state p {
      font-size: var(--font-size-base);
    }
  `]
})
export class SplitViewDemoComponent {
    items = signal<ListItem[]>([
        {
            id: 1,
            title: 'E-posta Uygulaması Projesi',
            description: 'Modern bir e-posta istemcisi için split-view layout implementasyonu',
            category: 'Proje'
        },
        {
            id: 2,
            title: 'Dosya Yöneticisi',
            description: 'Klasör ve dosya listesi için master-detail görünümü',
            category: 'Uygulama'
        },
        {
            id: 3,
            title: 'Kullanıcı Yönetim Paneli',
            description: 'Kullanıcı listesi ve detaylı profil bilgileri',
            category: 'Yönetim'
        },
        {
            id: 4,
            title: 'Not Alma Uygulaması',
            description: 'Sol panelde not listesi, sağda not editörü',
            category: 'Araç'
        },
        {
            id: 5,
            title: 'Ürün Kataloğu',
            description: 'Ürün listesi ve detaylı ürün bilgileri görünümü',
            category: 'E-ticaret'
        },
        {
            id: 6,
            title: 'Müşteri Destek Sistemi',
            description: 'Ticket listesi ve konuşma detayları',
            category: 'Destek'
        }
    ]);

    selectedItem = signal<ListItem | null>(null);

    selectItem(item: ListItem) {
        this.selectedItem.set(item);
    }
}
