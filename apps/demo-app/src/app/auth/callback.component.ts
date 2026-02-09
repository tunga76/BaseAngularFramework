import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@platform/auth';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-callback',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
    template: `
    <div class="callback-container">
      <mat-card>
        <mat-card-content>
          <div class="loading-state" *ngIf="!error">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Authenticating... Please wait.</p>
          </div>
          <div class="error-state" *ngIf="error">
            <h2>Authentication Error</h2>
            <p>{{ error }}</p>
            <button mat-raised-button color="primary" (click)="retry()">Retry Login</button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .callback-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #f5f5f5;
    }
    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      gap: 1rem;
    }
    h2 { color: #f44336; }
  `]
})
export class CallbackComponent implements OnInit {
    private auth = inject(AuthService);
    private router = inject(Router);
    error: string | null = null;

    ngOnInit() {
        this.auth.handleRedirectCallback().subscribe({
            next: (success) => {
                if (success) {
                    this.router.navigate(['/']);
                } else {
                    this.error = 'OAuth callback state mismatch or invalid code.';
                }
            },
            error: (err) => {
                this.error = 'Login failed: ' + (err.message || 'Unknown error');
                console.error(err);
            }
        });
    }

    retry() {
        this.auth.login();
    }
}
