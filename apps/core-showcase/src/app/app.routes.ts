import { Routes } from '@angular/router';
import { LoggerDemoComponent } from './pages/logger-demo/logger-demo.component';
import { StorageDemoComponent } from './pages/storage-demo/storage-demo.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'logger', pathMatch: 'full' },
    { path: 'logger', component: LoggerDemoComponent },
    { path: 'storage', component: StorageDemoComponent },

    {
        path: 'api',
        loadComponent: () => import('./pages/api-demo/api-demo.component').then(m => m.ApiDemoComponent)
    },
    {
        path: 'inactivity',
        loadComponent: () => import('./pages/inactivity-demo/inactivity-demo.component').then(m => m.InactivityDemoComponent)
    }
];
