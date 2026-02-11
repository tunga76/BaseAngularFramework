import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FullscreenLayoutComponent } from '@platform/ui-platform';

@Component({
    selector: 'app-fullscreen-demo',
    imports: [CommonModule, RouterLink, FullscreenLayoutComponent],
    template: `
    <platform-fullscreen-layout>
      <div class="fullscreen-content">
        <a routerLink="/" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Ana Sayfaya Dön
        </a>

        <div class="login-card">
          <div class="logo-section">
            <div class="logo-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            </div>
            <h1>Fullscreen Layout</h1>
            <p class="login-subtitle">Tam ekran içerik için minimal layout örneği</p>
          </div>

          <form class="login-form">
            <div class="form-group">
              <label for="email">E-posta</label>
              <input type="email" id="email" placeholder="ornek@email.com" />
            </div>

            <div class="form-group">
              <label for="password">Şifre</label>
              <input type="password" id="password" placeholder="••••••••" />
            </div>

            <button type="submit" class="btn-primary">Giriş Yap</button>
          </form>

          <div class="features-section">
            <h3>Layout Özellikleri</h3>
            <div class="feature-grid">
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Full viewport height</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Sidebar veya header yok</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Merkezi içerik odaklı</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Login/Landing pages için ideal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </platform-fullscreen-layout>
  `,
    styles: [`
    .fullscreen-content {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%);
      padding: var(--spacing-6);
      position: relative;
    }

    .back-link {
      position: absolute;
      top: var(--spacing-6);
      left: var(--spacing-6);
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      color: white;
      text-decoration: none;
      font-size: var(--font-size-sm);
      padding: var(--spacing-2) var(--spacing-4);
      border-radius: var(--radius-md);
      background-color: rgba(255, 255, 255, 0.1);
      transition: all 0.2s;
    }

    .back-link:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .login-card {
      background-color: var(--color-surface-0);
      border-radius: var(--radius-xl);
      padding: var(--spacing-8);
      max-width: 480px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .logo-section {
      text-align: center;
      margin-bottom: var(--spacing-8);
    }

    .logo-circle {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--spacing-4);
      color: white;
    }

    .logo-section h1 {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-2);
    }

    .login-subtitle {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .login-form {
      margin-bottom: var(--spacing-8);
    }

    .form-group {
      margin-bottom: var(--spacing-4);
    }

    .form-group label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-2);
    }

    .form-group input {
      width: 100%;
      padding: var(--spacing-3);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      transition: all 0.2s;
    }

    .form-group input:focus {
      outline: none;
      border-color: var(--color-primary-500);
      box-shadow: 0 0 0 3px var(--color-primary-100);
    }

    .btn-primary {
      width: 100%;
      padding: var(--spacing-3);
      background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .features-section {
      border-top: 1px solid var(--color-border);
      padding-top: var(--spacing-6);
    }

    .features-section h3 {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-4);
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-3);
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .feature-icon {
      color: var(--color-success-500);
      font-weight: var(--font-weight-bold);
    }
  `]
})
export class FullscreenDemoComponent { }
