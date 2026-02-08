import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { AuthService } from '@platform/auth';
import { InactivityService } from '@platform/core';
import { ConfirmService } from '@platform/ui-feedback';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Modular Platform Demo</h1>
      
      <div *ngIf="loading" class="status">Loading...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="isAuthenticated$ | async; else loginTpl">
        <div class="card">
          <h2>Welcome, {{ (claims$ | async)?.preferred_username || (claims$ | async)?.sub || 'User' }}</h2>
          <button (click)="logout()">Logout</button>
          
          <h3>User Claims</h3>
          <pre>{{ claims$ | async | json }}</pre>
          
          <h3>Access Token</h3>
          <button (click)="showToken()">Log Token to Console</button>
        </div>
      </div>

      <ng-template #loginTpl>
        <div class="card">
          <h2>Not Authenticated</h2>
          <p>Please login to continue.</p>
          <button (click)="login()">Login</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; font-family: sans-serif; padding: 2rem; }
    .card { border: 1px solid #ccc; padding: 1rem; border-radius: 8px; margin-top: 1rem; background: #f9f9f9; }
    .error { color: #721c24; background: #f8d7da; padding: 1rem; border-radius: 4px; border: 1px solid #f5c6cb; }
    .status { background: #d1ecf1; padding: 1rem; border-radius: 4px; border: 1px solid #bee5eb; margin-bottom: 1rem; }
    pre { background: #333; color: #fff; padding: 1rem; overflow: auto; border-radius: 4px; }
    button { padding: 0.6rem 1.2rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    button:hover { background: #0056b3; }
  `]
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);
  private inactivity = inject(InactivityService);
  private confirm = inject(ConfirmService);

  isAuthenticated$: Observable<boolean>;
  claims$: Observable<any>;
  loading = false;
  error: string | null = null;

  constructor() {
    this.isAuthenticated$ = this.auth.isAuthenticated$();
    this.claims$ = of(this.auth.getUserClaims());

    // Inactivity warning handling
    this.inactivity.warning$.subscribe(isWarning => {
      if (isWarning) {
        this.confirm.ask('Your session is about to expire due to inactivity. Stay logged in?')
          .subscribe(keepAlive => {
            if (keepAlive) {
              this.inactivity.reset();
            }
          });
      }
    });
  }

  ngOnInit() {
    // Handle PKCE redirect callback
    if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
      this.loading = true;
      this.auth.handleRedirectCallback().subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            window.history.replaceState({}, document.title, window.location.pathname);
            this.claims$ = of(this.auth.getUserClaims());
          } else {
            this.error = 'OAuth callback state mismatch or invalid code.';
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Login failed: ' + (err.message || 'Unknown error');
          console.error(err);
        }
      });
    }
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }

  showToken() {
    this.auth.getAccessToken().subscribe(token => {
      console.log('Access Token:', token);
      alert('Token logged to console');
    });
  }
}
