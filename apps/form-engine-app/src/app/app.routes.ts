import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { KitchenSinkComponent } from './pages/kitchen-sink/kitchen-sink.component';
import { ConditionalLogicComponent } from './pages/conditional-logic/conditional-logic.component';
import { ValidationTestComponent } from './pages/validation-test/validation-test.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'kitchen-sink', component: KitchenSinkComponent },
    { path: 'conditional-logic', component: ConditionalLogicComponent },
    { path: 'validation-test', component: ValidationTestComponent }
];
