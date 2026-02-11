import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'dynamic-layout-demo',
        loadComponent: () => import('./pages/dynamic-layout-demo/dynamic-layout-demo.component').then(m => m.DynamicLayoutDemoComponent)
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'dashboard-demo',
        loadComponent: () => import('./pages/dashboard-demo/dashboard-demo.component').then(m => m.DashboardDemoComponent)
    },
    {
        path: 'fullscreen-demo',
        loadComponent: () => import('./pages/fullscreen-demo/fullscreen-demo.component').then(m => m.FullscreenDemoComponent)
    },
    {
        path: 'split-view-demo',
        loadComponent: () => import('./pages/split-view-demo/split-view-demo.component').then(m => m.SplitViewDemoComponent)
    }
];
