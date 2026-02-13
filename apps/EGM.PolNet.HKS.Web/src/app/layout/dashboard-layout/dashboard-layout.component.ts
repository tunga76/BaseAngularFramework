import { Component, Input, signal, ChangeDetectionStrategy, inject, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'platform-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent, FooterComponent],
  template: `
    <div class="layout-container">
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="collapsed()">
        <app-sidebar [collapsed]="collapsed()" (toggle)="toggleSidebar()"></app-sidebar>
        <ng-content select="[sidebar-extra]"></ng-content>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="top-bar">
           <button class="toggle-btn" (click)="toggleSidebar()" aria-label="Menüyü Daralt/Genişlet">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
           </button>
           <app-navbar></app-navbar>
           <ng-content select="[top-bar-extra]"></ng-content>
        </header>
        
        <div class="page-content">
           <div class="content-wrapper">
             <router-outlet></router-outlet>
             <ng-content></ng-content>
           </div>
           <app-footer></app-footer>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background-color: #f1f5f9; /* Slate-100 for better contrast with sidebar */
    }

    .sidebar {
      width: 260px;
      min-width: 0;
      background-color: #0f172a; /* Match sidebar background */
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      white-space: nowrap;
      z-index: 20;
    }

    .sidebar.collapsed {
      width: 0;
      border-right: none;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    .top-bar {
      height: 64px;
      background-color: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px) saturate(180%);
      -webkit-backdrop-filter: blur(12px) saturate(180%);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      padding: 0 var(--spacing-4);
      gap: var(--spacing-4);
      z-index: 10;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }

    .toggle-btn {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      cursor: pointer;
      padding: var(--spacing-2);
      border-radius: var(--radius-md);
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      box-shadow: var(--shadow-sm);
    }
    .toggle-btn:hover {
      background-color: white;
      border-color: #cbd5e1;
      color: #0f172a;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }

    .page-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-6);
      display: flex;
      flex-direction: column;
    }

    .content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .top-bar app-navbar {
      flex: 1;
      display: flex;
      height: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();

  collapsed = signal(false);

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result.matches) {
          this.collapsed.set(true);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar() {
    this.collapsed.update(v => !v);
  }
}
