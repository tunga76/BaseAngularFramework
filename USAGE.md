# Platform Usage Guide

This repository contains a modular frontend platform designed for enterprise usage.

## Installation

The libraries are designed to be published to a private npm registry (e.g., Nexus, Artifactory).

```bash
npm install @platform/core @platform/auth @platform/ui-feedback @platform/observability
```

## Setup in Application

In your `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideCore } from '@platform/core';
import { provideAuth, authInterceptor } from '@platform/auth';
import { provideUiFeedback } from '@platform/ui-feedback';
import { provideObservability, apiPerformanceInterceptor } from '@platform/observability';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCore({
      apiUrl: 'https://api.enterprise.com',
      production: false,
      logLevel: 'debug',
      inactivity: {
        enabled: true,
        idleTimeoutMs: 15 * 60 * 1000, // 15 minutes
        warningBeforeMs: 60 * 1000     // 1 minute warning
      }
    }),
    provideAuth({
      clientId: 'my-app',
      issuer: 'https://auth.enterprise.com',
      redirectUri: window.location.origin + '/callback',
      scope: 'openid profile email offline_access'
    }),
    provideUiFeedback(),
    provideObservability({
      enabled: true,
      plugins: [], // Add SentryPlugin, etc. here
      trackRouteChanges: true
    }),
    // Composing interceptors
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        apiPerformanceInterceptor
      ])
    )
  ]
};
```

## Content usage

### ApiClient (instead of HttpClient)

```typescript
import { ApiClient } from '@platform/core';

@Component(...)
export class MyComponent {
  private api = inject(ApiClient);

  getData() {
    return this.api.get('/users').subscribe();
  }
}
```

### Auth Protection

```typescript
const routes: Routes = [
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] 
  }
];
```

### UI Feedback

```typescript
import { ConfirmService } from '@platform/ui-feedback';

export class MyComponent {
  private confirm = inject(ConfirmService);

  async delete() {
    const ok = await firstValueFrom(this.confirm.ask('Are you sure?'));
    if (ok) {
       // delete logic
    }
  }
}
### Inactivity Handling

Configuration is done in `provideCore`. To handle the warning (e.g., showing a modal):

```typescript
import { InactivityService } from '@platform/core';
import { ConfirmService } from '@platform/ui-feedback';

@Component(...)
export class AppComponent {
  private inactivity = inject(InactivityService);
  private confirm = inject(ConfirmService);

  constructor() {
    this.inactivity.warning$.subscribe(isWarning => {
      if (isWarning) {
        this.confirm.ask('Your session is about to expire. Stay logged in?')
          .subscribe(keepAlive => {
            if (keepAlive) {
              this.inactivity.reset();
            }
          });
      }
    });
  }
}
```
