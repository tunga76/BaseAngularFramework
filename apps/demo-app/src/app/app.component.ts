import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthService } from '@platform/auth';
import { SpinnerService } from '@platform/ui-feedback';
import { MenuService, MenuItem } from '@platform/core';
import { Observable, filter, map, mergeMap } from 'rxjs';
import { LayoutRegistryService } from 'libs/ui-platform/src/lib/services/layout-registry.service';
import { DashboardLayoutComponent } from 'libs/ui-platform/src/lib/layouts/dashboard-layout/dashboard-layout.component';
import { FullScreenLayoutComponent } from 'libs/ui-platform/src/lib/layouts/fullscreen-layout/fullscreen-layout.component';
import { SplitViewLayoutComponent } from 'libs/ui-platform/src/lib/layouts/split-view-layout/split-view-layout.component';
import { ThemeProviderComponent, ThemeConfig } from 'libs/ui-platform/src/lib/theme/theme-provider.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    NgxSpinnerModule,
    ThemeProviderComponent,
    DashboardLayoutComponent,
    FullScreenLayoutComponent,
    SplitViewLayoutComponent
  ],
  template: `
    <platform-theme-provider [config]="themeConfig">
      <!-- Layout Switcher based on Signals -->
      <ng-container [ngSwitch]="layoutRegistry.getActiveLayout()">
        
        <platform-dashboard-layout *ngSwitchCase="'dashboard'">
           <div sidebar-header style="padding: 20px; font-weight: bold; font-size: 1.2rem; color: var(--color-primary);">
            Platform Framework
          </div>
          <div sidebar-nav>
             <ng-container *ngFor="let item of menuService.menuItems()">
                <button mat-button [routerLink]="item.route" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}" style="width: 100%; text-align: left; justify-content: flex-start; padding: 12px;">
                  <mat-icon *ngIf="item.icon" style="margin-right: 8px;">{{ item.icon }}</mat-icon>
                  {{ item.label }}
                </button>
              </ng-container>
          </div>
          <div top-bar style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
             <span style="font-weight: 500;">Enterprise Platform UI</span>
             <button mat-icon-button *ngIf="isAuthenticated$ | async" (click)="logout()" title="Logout">
              <mat-icon>logout</mat-icon>
            </button>
          </div>
          <router-outlet></router-outlet>
        </platform-dashboard-layout>

        <platform-fullscreen-layout *ngSwitchCase="'fullscreen'">
          <router-outlet></router-outlet>
        </platform-fullscreen-layout>

        <platform-split-view-layout *ngSwitchCase="'split'">
           <div left-pane style="padding: 20px;">
              <h3>Navigation</h3>
              <ng-container *ngFor="let item of menuService.menuItems()">
                <div [routerLink]="item.route" style="cursor: pointer; padding: 8px 0;">{{ item.label }}</div>
              </ng-container>
           </div>
           <div right-pane>
              <router-outlet></router-outlet>
           </div>
        </platform-split-view-layout>

        <!-- Default Layout fallback -->
        <main *ngSwitchDefault class="content-area">
           <router-outlet></router-outlet>
        </main>
      </ng-container>
    </platform-theme-provider>

    <ngx-spinner bdColor="rgba(0, 0, 0, 0.8)" size="medium" color="#fff" type="ball-scale-multiple" [fullScreen]="true">
      <p style="color: white"> {{ spinnerService.message }} </p>
    </ngx-spinner>
  `,
  styles: [`
    .active-link { background: rgba(63, 81, 181, 0.1) !important; color: var(--color-primary) !important; }
    .content-area { min-height: 100vh; background: #f8f9fa; }
  `]
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);
  public spinnerService = inject(SpinnerService);
  public menuService = inject(MenuService);
  public layoutRegistry = inject(LayoutRegistryService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  isAuthenticated$: Observable<boolean>;
  themeConfig: ThemeConfig = { mode: 'light' };

  constructor() {
    this.isAuthenticated$ = this.auth.isAuthenticated$();
    this.initMenu();
    this.registerLayouts();
  }

  ngOnInit() {
    // Listen to route changes to switch layout
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      if (data['layout']) {
        this.layoutRegistry.setActiveLayout(data['layout']);
      }
    });
  }

  private registerLayouts() {
    this.layoutRegistry.registerLayout('dashboard', DashboardLayoutComponent);
    this.layoutRegistry.registerLayout('fullscreen', FullScreenLayoutComponent);
    this.layoutRegistry.registerLayout('split', SplitViewLayoutComponent);
  }

  private initMenu() {
    const menu: MenuItem[] = [
      { id: 'home', label: 'Home', icon: 'home', route: '/' },
      { id: 'admin', label: 'Admin Panel', icon: 'admin_panel_settings', route: '/admin', permission: 'Kullanici' },
      { id: 'reports', label: 'Reports', icon: 'bar_chart', route: '/reports', permission: 'Kullanici' },
      { id: 'settings', label: 'Settings', icon: 'settings', route: '/settings' },
      { id: 'forms', label: 'Forms', icon: 'dynamic_form', route: '/forms' },
      { id: 'directives', label: 'Directives', icon: 'extension', route: '/directives' }

    ];
    this.menuService.setMenu(menu);
  }

  logout() {
    this.auth.logout();
  }
}

