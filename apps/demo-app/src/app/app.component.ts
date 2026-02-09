import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthService } from '@platform/auth';
import { SpinnerService } from '@platform/ui-feedback';
import { MenuService, MenuItem } from '@platform/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    NgxSpinnerModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <div class="logo-section">
        <mat-icon class="logo-icon">auto_awesome</mat-icon>
        <span class="logo-text">Platform Framework</span>
      </div>
      
      <span class="spacer"></span>
      
      <div class="nav-links">
        <ng-container *ngFor="let item of menuService.menuItems()">
          <button mat-button [routerLink]="item.route" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon *ngIf="item.icon">{{ item.icon }}</mat-icon>
            {{ item.label }}
          </button>
        </ng-container>
      </div>

      <div class="auth-section">
        <button mat-icon-button *ngIf="isAuthenticated$ | async" (click)="logout()" title="Logout" class="logout-btn">
          <mat-icon>logout</mat-icon>
        </button>
      </div>
    </mat-toolbar>

    <ngx-spinner bdColor="rgba(0, 0, 0, 0.8)" size="medium" color="#fff" type="ball-scale-multiple" [fullScreen]="true">
      <p style="color: white"> {{ spinnerService.message }} </p>
    </ngx-spinner>

    <main class="content-area">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .app-toolbar {
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      padding: 0 2rem;
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .logo-icon { color: #ffd700; transform: scale(1.2); }
    .logo-text { font-weight: 600; letter-spacing: 0.5px; }
    .nav-links { display: flex; gap: 0.5rem; margin: 0 1.5rem; }
    .active-link { background: rgba(255,255,255,0.15) !important; color: #ffd700 !important; }
    .content-area { min-height: calc(100vh - 64px); background: #f8f9fa; }
    .logout-btn { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .logout-btn:hover { transform: rotate(-15deg) scale(1.1); color: #ff5252; }
  `]
})
export class AppComponent {
  private auth = inject(AuthService);
  public spinnerService = inject(SpinnerService);
  public menuService = inject(MenuService);

  isAuthenticated$: Observable<boolean>;

  constructor() {
    this.isAuthenticated$ = this.auth.isAuthenticated$();
    this.initMenu();
  }

  private initMenu() {
    const menu: MenuItem[] = [
      { id: 'home', label: 'Home', icon: 'home', route: '/' },
      { id: 'admin', label: 'Admin Panel', icon: 'admin_panel_settings', route: '/admin', permission: 'Kullanici' },
      { id: 'reports', label: 'Reports', icon: 'bar_chart', route: '/reports', permission: 'Kullanici' },
      { id: 'settings', label: 'Settings', icon: 'settings', route: '/settings' },
      { id: 'forms', label: 'Forms', icon: 'dynamic_form', route: '/forms' }
    ];
    this.menuService.setMenu(menu);
  }

  logout() {
    this.auth.logout();
  }
}
