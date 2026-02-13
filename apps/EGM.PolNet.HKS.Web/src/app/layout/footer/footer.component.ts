import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    template: `
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2026 EGM PolNet HKS. Tüm Hakları Saklıdır.</p>
        <div class="links">
          <a href="#">Yardım Merkezi</a>
          <a href="#">Gizlilik Politikası</a>
          <a href="#">Kullanım Şartları</a>
        </div>
      </div>
    </footer>
  `,
    styles: [`
    .footer {
      padding: var(--spacing-4) 0;
      border-top: 1px solid var(--color-border);
      color: var(--color-text-secondary);
      font-size: 0.85rem;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .links {
      display: flex;
      gap: var(--spacing-4);
    }
    .links a {
      color: var(--color-text-tertiary);
      text-decoration: none;
    }
    .links a:hover {
      color: var(--color-text-secondary);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent { }
