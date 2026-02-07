import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserClaims } from '@my-org/auth-core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container">
      <h1>Auth Core Demo</h1>
      
      <div *ngIf="loading" class="status">Loading...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="isAuthenticated$ | async; else loginTpl">
        <div class="card">
          <h2>Welcome, {{ (user$ | async)?.name || 'User' }}</h2>
          <button (click)="logout()">Logout</button>
          
          <h3>User Claims</h3>
          <pre>{{ user$ | async | json }}</pre>
          
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
    .container { max-width: 800px; margin: 0 auto; font-family: sans-serif; }
    .card { border: 1px solid #ccc; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
    .error { color: red; background: #fee; padding: 0.5rem; }
    pre { background: #eee; padding: 1rem; overflow: auto; }
    button { padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #0056b3; }
  `]
})
export class AppComponent implements OnInit {
    isAuthenticated$: Observable<boolean>;
    user$: Observable<UserClaims | null>;
    loading = false;
    error: string | null = null;

    constructor(private auth: AuthService) {
        this.isAuthenticated$ = this.auth.isAuthenticated$();
        this.user$ = this.auth.getUserClaims();
    }

    ngOnInit() {
        // Handle callback if present
        if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
            this.loading = true;
            this.auth.handleRedirectCallback().subscribe({
                next: () => {
                    this.loading = false;
                    // Clear query params to look nice
                    window.history.replaceState({}, document.title, window.location.pathname);
                },
                error: (err) => {
                    this.loading = false;
                    this.error = err.message || 'Login failed';
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
        console.log(this.auth.getAccessToken());
    }
}
