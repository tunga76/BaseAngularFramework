import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideCore } from './core/core.providers';
import { provideFormErrors } from './shared/ui/form/errors/form-error.module';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        ...provideCore(),
        provideFormErrors
    ]
};
