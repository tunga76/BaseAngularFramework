import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@platform/auth';
import { SpinnerComponent } from '@platform/ui-platform';

@Component({
    selector: 'app-callback',
    standalone: true,
    imports: [CommonModule, SpinnerComponent],
    template: `
    <div class="callback-container">
      <platform-spinner size="lg" variant="spinner" label="Processing login..."></platform-spinner>
    </div>
  `,
    styles: [`
    .callback-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class CallbackComponent implements OnInit {
    private auth = inject(AuthService);
    private router = inject(Router);

    ngOnInit() {
        this.auth.handleRedirectCallback().subscribe({
            next: (success) => {
                if (success) {
                    this.router.navigate(['/']);
                } else {
                    console.error('Login failed in callback');
                    this.router.navigate(['/']);
                }
            },
            error: (err) => {
                console.error('Callback error:', err);
                this.router.navigate(['/']);
            }
        });
    }
}
