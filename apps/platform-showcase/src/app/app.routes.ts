import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ButtonShowcaseComponent } from './pages/button-showcase/button-showcase.component';
import { InputShowcaseComponent } from './pages/input-showcase/input-showcase.component';
import { CardShowcaseComponent } from './pages/card-showcase/card-showcase.component';
import { BadgeChipShowcaseComponent } from './pages/badge-chip-showcase/badge-chip-showcase.component';
import { SpinnerShowcaseComponent } from './pages/spinner-showcase/spinner-showcase.component';
import { ModalShowcaseComponent } from './pages/modal-showcase/modal-showcase.component';
import { DropdownShowcaseComponent } from './pages/dropdown-showcase/dropdown-showcase.component';
import { LayoutsShowcaseComponent } from './pages/layouts-showcase/layouts-showcase.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'button', component: ButtonShowcaseComponent },
    { path: 'input', component: InputShowcaseComponent },
    { path: 'card', component: CardShowcaseComponent },
    { path: 'badge-chip', component: BadgeChipShowcaseComponent },
    { path: 'spinner', component: SpinnerShowcaseComponent },
    { path: 'modal', component: ModalShowcaseComponent },
    { path: 'dropdown', component: DropdownShowcaseComponent },
    { path: 'layouts', component: LayoutsShowcaseComponent },
    { path: 'kitchen-sink', loadComponent: () => import('./pages/kitchen-sink/kitchen-sink.component').then(m => m.KitchenSinkComponent) },
    { path: 'passenger-registration', loadComponent: () => import('./passenger-registration/passenger-registration.component').then(m => m.PassengerRegistrationComponent) }
];
