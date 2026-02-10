import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProtectedComponent } from './pages/protected/protected.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { authGuard, permissionGuard } from '@platform/auth';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'protected',
        component: ProtectedComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [authGuard, permissionGuard('admin')]
    },
    { path: 'callback', component: CallbackComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '**', redirectTo: '' }
];
