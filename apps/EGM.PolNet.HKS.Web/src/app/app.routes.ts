import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: DashboardLayoutComponent,
    },
    {
        path: 'admin',
        component: DashboardLayoutComponent,
        // canActivate: [authGuard],
        children: [
            {
                path: 'users',
                loadChildren: () => import('./domains/users/users.routes').then(m => m.USERS_ROUTES)
            },
            {
                path: 'giris-cikis',
                loadComponent: () => import('./domains/giriscikis/pages/giriscikisyonetim/giriscikisyonetim.component').then(m => m.GiriscikisyonetimComponent)
            },
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./domains/identity/identity.routes').then(m => m.IDENTITY_ROUTES)
    }
];
