import { Component, inject, OnInit, OnDestroy, signal, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@platform/auth';
import { ButtonComponent, CardComponent, BadgeComponent } from '@platform/ui-platform';
import { STORAGE_SERVICE, CORE_CONFIG } from '@platform/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, BadgeComponent],
  template: `
    <div class="home-container">
      <h1>Auth Library Showcase</h1>
      <p class="subtitle">Demonstrating Authentication & Authorization Flows</p>

      <!-- Auth Status Card -->
      <platform-card [padded]="true" class="status-card">
        <div card-header>
          <div class="header-content">
            <h2>Authentication Status</h2>
            <platform-badge 
              [variant]="auth.isAuthenticated() ? 'success' : 'neutral'"
              [size]="'lg'">
              {{ auth.isAuthenticated() ? 'Authenticated' : 'Guest' }}
            </platform-badge>
          </div>
        </div>

        <div card-content>
          <div *ngIf="!auth.isAuthenticated()" class="guest-view">
            <p>You are currently not logged in. Click the button below to start the OAuth2 flow.</p>
            <div class="actions">
              <platform-button (onClick)="login()" variant="primary">
                Login with IdentityServer
              </platform-button>
            </div>
          </div>

          <div *ngIf="auth.isAuthenticated()" class="authenticated-view">
            <div class="user-info">
              <h3>User Claims</h3>
              <pre>{{ auth.getUserClaims() | json }}</pre>
            </div>

            <!-- Inactivity Timer Section -->
            <div class="inactivity-info" *ngIf="inactivityEnabled">
              <h3>Session Inactivity</h3>
              <div class="countdown-container" [class.warning]="isInactivityWarning()">
                <div class="countdown-header">
                  <span class="label">Auto-Logout due to Inactivity in:</span>
                  <span class="time">{{ inactivityTimeDisplay() }}</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" [style.width.%]="inactivityPercent()"></div>
                </div>
                <div class="expiry-details">
                   <small>Interact (move mouse, click) to reset.</small>
                </div>
              </div>
            </div>

            <div class="token-info">
              <div class="section-header">
                <h3>Access Token Status</h3>
                <span *ngIf="showRefreshSuccess()" class="refresh-badge success fade-in">
                  ✨ Token Refreshed!
                </span>
                <span *ngIf="isAutoRefreshing()" class="refresh-badge info fade-in">
                  🔄 Auto-Refreshing...
                </span>
              </div>
              
              <!-- Token Countdown Display -->
              <div class="countdown-container" [class.warning]="isTokenExpiringSoon()">
                <div class="countdown-header">
                  <span class="label">Token Refresh In:</span>
                  <span class="time">{{ tokenTimeDisplay() }}</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" [style.width.%]="tokenProgressPercent()"></div>
                </div>
                <!-- Enhanced Debug Info -->
                <div class="expiry-details debug-info">
                  <div>Expires: {{ auth.expiresAt() | date:'mediumTime' }}</div>
                  <div>(TTL: {{ currentTtl() }}s)</div>
                </div>
              </div>

              <div class="token-box">
                {{ auth.accessToken() }}
              </div>
            </div>

            <div class="actions">
              <platform-button (onClick)="refresh()" variant="secondary">
                Force Refresh Token
              </platform-button>
              <platform-button (onClick)="logout()" variant="danger">
                Logout
              </platform-button>
            </div>
          </div>
        </div>
      </platform-card>
    </div>
  `,
  styles: [`
    .home-container { max-width: 800px; margin: 0 auto; padding: 24px; }
    .subtitle { color: var(--color-text-muted); font-size: 1.1rem; margin-bottom: 32px; }
    .header-content { display: flex; justify-content: space-between; align-items: center; }
    .status-card { margin-bottom: 24px; display: block; }
    .guest-view { text-align: center; padding: 32px 0; }
    .actions { display: flex; gap: 12px; margin-top: 24px; justify-content: center; }
    .authenticated-view .actions { justify-content: flex-start; }
    pre { background: #1e293b; color: #e2e8f0; padding: 16px; border-radius: 8px; overflow: auto; font-size: 0.9rem; max-height: 200px; }
    .token-box { background: #f1f5f9; padding: 12px; border-radius: 6px; word-break: break-all; font-family: monospace; font-size: 0.85rem; color: #475569; max-height: 100px; overflow-y: auto; margin-top: 16px; }
    h3 { font-size: 1rem; color: var(--color-text); margin: 0; }
    .section-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 8px; margin-bottom: 16px; height: 32px; }
    .refresh-badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; white-space: nowrap; }
    .refresh-badge.success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .refresh-badge.info { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .fade-in { animation: fadeIn 0.5s ease-in; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
    .user-info, .token-info, .inactivity-info { margin-bottom: 24px; }
    .countdown-container { background: #f0f9ff; border: 1px solid #bae6fd; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
    .countdown-container.warning { background: #fffbeb; border-color: #fcd34d; }
    .countdown-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .label { font-weight: 500; color: var(--color-text-muted); }
    .time { font-size: 1.2rem; font-weight: 700; font-family: monospace; color: var(--color-primary); }
    .countdown-container.warning .time { color: var(--color-warning); }
    .progress-track { height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--color-primary); transition: width 0.2s linear; }
    .countdown-container.warning .progress-fill { background: var(--color-warning); }
    .expiry-details { display: flex; justify-content: space-between; color: var(--color-text-muted); margin-top: 4px; font-size: 0.8rem; }
    .debug-info { font-family: monospace; }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  storage = inject(STORAGE_SERVICE);
  config = inject(CORE_CONFIG);

  tokenTimeDisplay = signal('00:00');
  tokenProgressPercent = signal(100);
  isTokenExpiringSoon = signal(false);
  isAutoRefreshing = signal(false);
  showRefreshSuccess = signal(false);
  currentTtl = signal(0);

  private tokenTotalDuration = 0;
  private lastToken: string | null = null;
  private lastExpiresAt: number | null = null;

  inactivityTimeDisplay = signal('00:00');
  inactivityPercent = signal(100);
  isInactivityWarning = signal(false);
  inactivityEnabled = false;

  private intervalId: any;
  private refreshTriggered = false; // Flag to prevent multiple triggers

  constructor() {
    effect(() => {
      const currentToken = this.auth.accessToken();
      const currentExpiresAt = this.auth.expiresAt();

      untracked(() => {
        if (currentToken && this.lastToken && currentToken !== this.lastToken) {
          this.handleTokenRefresh();
        } else if (currentExpiresAt && this.lastExpiresAt && currentExpiresAt > this.lastExpiresAt) {
          this.handleTokenRefresh();
        }
        this.lastToken = currentToken;
        this.lastExpiresAt = currentExpiresAt;
      });
    });
  }

  private handleTokenRefresh() {
    console.log('Token refresh detected!');
    this.showRefreshSuccess.set(true);
    setTimeout(() => this.showRefreshSuccess.set(false), 4000);

    this.isAutoRefreshing.set(false);
    this.refreshTriggered = false; // Reset trigger flag

    // Reset baseline for progress bar
    this.tokenTotalDuration = 0;
    this.updateTokenCountdown();
  }

  ngOnInit() {
    this.inactivityEnabled = this.config.inactivity?.enabled || false;
    this.startTimers();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startTimers() {
    this.intervalId = setInterval(() => {
      this.updateTokenCountdown();
      if (this.inactivityEnabled) {
        this.updateInactivityCountdown();
      }
    }, 1000);

    this.updateTokenCountdown(); // Initial call
    if (this.inactivityEnabled) {
      this.updateInactivityCountdown();
    }
  }

  private updateTokenCountdown() {
    const expiresAt = this.auth.expiresAt();
    if (!expiresAt) {
      this.tokenTimeDisplay.set('--:--');
      this.tokenProgressPercent.set(0);
      return;
    }

    const now = Date.now();
    const diff = expiresAt - now;
    const diffSec = Math.floor(diff / 1000);
    this.currentTtl.set(diffSec);

    // Explicitly TRIGGER refresh if within 30s window and not already triggered
    if (diff <= 30000 && diff > 2000 && !this.refreshTriggered) {
      console.log('Auto-refresh threshold reached. Triggering refresh...');
      this.refreshTriggered = true;
      this.isAutoRefreshing.set(true);

      this.auth.refresh().subscribe({
        next: () => console.log('Auto-refresh call successful'),
        error: (err) => {
          console.error('Auto-refresh call failed', err);
          this.isAutoRefreshing.set(false);
          this.refreshTriggered = false; // Allow retry on next tick
        }
      });
    }

    if (diff <= 0) {
      this.tokenTimeDisplay.set('Expired');
      this.tokenProgressPercent.set(0);
      this.isTokenExpiringSoon.set(true);
      return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    this.tokenTimeDisplay.set(`${minutes}:${seconds.toString().padStart(2, '0')}`);

    if (this.tokenTotalDuration === 0) {
      this.tokenTotalDuration = diff;
    } else if (diff > this.tokenTotalDuration + 2000) {
      this.tokenTotalDuration = diff;
    }

    if (this.tokenTotalDuration < diff) this.tokenTotalDuration = diff;

    const percent = Math.min(100, Math.max(0, (diff / this.tokenTotalDuration) * 100));
    this.tokenProgressPercent.set(percent);
    this.isTokenExpiringSoon.set(diff < 60000);
  }

  private updateInactivityCountdown() {
    const statsKey = 'platform_last_activity';
    const lastActivityStr = this.storage.getItem(statsKey);
    if (!lastActivityStr) return;

    const lastActivity = parseInt(lastActivityStr, 10);
    const idleTimeout = this.config.inactivity?.idleTimeoutMs || 0;
    const now = Date.now();
    const elapsed = now - lastActivity;
    const remaining = idleTimeout - elapsed;

    if (remaining <= 0) {
      this.inactivityTimeDisplay.set('Logging out...');
      this.inactivityPercent.set(0);
      return;
    }

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    this.inactivityTimeDisplay.set(`${minutes}:${seconds.toString().padStart(2, '0')}`);

    const percent = Math.min(100, Math.max(0, (remaining / idleTimeout) * 100));
    this.inactivityPercent.set(percent);
    const warningThreshold = this.config.inactivity?.warningBeforeMs || 10000;
    this.isInactivityWarning.set(remaining < warningThreshold);
  }

  login() { this.auth.login(); }
  logout() { this.auth.logout(); }

  refresh() {
    this.auth.refresh().subscribe({
      next: () => console.log('Manual refresh success'),
      error: (err) => console.error('Manual refresh failed:', err)
    });
  }
}
