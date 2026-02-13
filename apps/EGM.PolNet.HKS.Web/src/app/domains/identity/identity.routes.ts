import { Routes } from '@angular/router';

export const IDENTITY_ROUTES: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    }
];
