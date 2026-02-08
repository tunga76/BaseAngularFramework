import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthService } from '@platform/auth';
import { InactivityService } from '@platform/core';
import { ConfirmService, AlertService, ToastService, SpinnerService, ToastType } from '@platform/ui-feedback';
import { TrackerService } from '@platform/observability';
import { TestApiService, Post } from './test/test-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    NgxSpinnerModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Modular Platform Demo</span>
      <span class="spacer"></span>
      <button mat-icon-button *ngIf="isAuthenticated$ | async" (click)="logout()" title="Logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <ngx-spinner bdColor="rgba(0, 0, 0, 0.8)" size="medium" color="#fff" type="ball-scale-multiple" [fullScreen]="true">
      <p style="color: white"> {{ spinnerMessage }} </p>
    </ngx-spinner>

    <div class="container">
      <div *ngIf="loading" class="spinner-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Loading...</p>
      </div>

      <div *ngIf="error" class="error-card">
        <mat-icon color="warn">error</mat-icon>
        <span>{{ error }}</span>
      </div>

      <div *ngIf="isAuthenticated$ | async; else loginTpl" class="fade-in">
        <mat-card class="main-card">
          <mat-card-header>
            <div mat-card-avatar class="user-avatar">
              <mat-icon>account_circle</mat-icon>
            </div>
            <mat-card-title>Welcome, {{ (claims$ | async)?.preferred_username || (claims$ | async)?.sub || 'User' }}</mat-card-title>
            <mat-card-subtitle>Authenticated Session</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <h3>User Claims</h3>
            <pre class="claims-json">{{ claims$ | async | json }}</pre>
            
            <mat-divider></mat-divider>
            
            <div class="actions">
              <button mat-raised-button color="accent" (click)="showToken()">
                <mat-icon>key</mat-icon> Log Token to Console
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="testing-card">
        <mat-card-header>
          <mat-card-title>UI Feedback Testing</mat-card-title>
          <mat-card-subtitle>Material Service Integration</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="test-buttons">
            <button mat-stroked-button color="primary" (click)="testConfirm()">
              <mat-icon>help_outline</mat-icon> Test Confirm
            </button>
            <button mat-stroked-button color="success" class="btn-success" (click)="testAlert()">
              <mat-icon>check_circle</mat-icon> Test Success Alert
            </button>
            <button mat-stroked-button color="warn" (click)="testError()">
              <mat-icon>report_problem</mat-icon> Test Error Alert
            </button>
            
            <div class="toast-buttons">
              <button mat-mini-fab color="primary" (click)="testToast('info')" matTooltip="Info Toast" title="Info">
                <mat-icon>info</mat-icon>
              </button>
              <button mat-mini-fab class="btn-success" (click)="testToast('success')" matTooltip="Success Toast" title="Success">
                <mat-icon>check_circle</mat-icon>
              </button>
              <button mat-mini-fab class="btn-warning" (click)="testToast('warning')" matTooltip="Warning Toast" title="Warning">
                <mat-icon>warning</mat-icon>
              </button>
              <button mat-mini-fab color="warn" (click)="testToast('error')" matTooltip="Error Toast" title="Error">
                <mat-icon>error</mat-icon>
              </button>
            </div>

            <div class="toast-positions">
              <button mat-stroked-button (click)="testToast('info', 'start', 'top')">Top Left</button>
              <button mat-stroked-button (click)="testToast('success', 'end', 'top')">Top Right</button>
              <button mat-stroked-button (click)="testToast('warning', 'start', 'bottom')">Bottom Left</button>
              <button mat-stroked-button (click)="testToast('error', 'end', 'bottom')">Bottom Right</button>
              <button mat-stroked-button (click)="testToast('info', 'center', 'bottom')">Bottom Center</button>
            </div>

            <button mat-flat-button color="accent" (click)="testSpinner('ball-scale-multiple', 'Vibrant Scale')">
              <mat-icon>sync</mat-icon> Scale Spinner
            </button>
            <button mat-flat-button color="primary" (click)="testSpinner('ball-spin-clockwise', 'Loading...')">
              <mat-icon>refresh</mat-icon> Clockwise Spinner
            </button>
            <button mat-flat-button color="warn" (click)="testSpinner('fire', 'Burning...')">
              <mat-icon>local_fire_department</mat-icon> Fire Spinner
            </button>
          </div>
        </mat-card-content>
        </mat-card>
      <mat-card class="testing-card">
        <mat-card-header>
          <mat-card-title>Platform HTTP Testing</mat-card-title>
          <mat-card-subtitle>TestApiService Integration</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="test-buttons">
            <button mat-raised-button color="primary" (click)="apiGetPosts()">Get Posts</button>
            <button mat-raised-button color="accent" (click)="apiGetPost()">Get Post #1</button>
            <button mat-raised-button color="warn" (click)="apiError()">Get Error</button>
            <button mat-stroked-button (click)="apiCreate()">Create Post</button>
            <button mat-stroked-button (click)="apiUpdate()">Update Post</button>
            <button mat-stroked-button color="warn" (click)="apiDelete()">Delete Post</button>
          </div>
          
          <div *ngIf="apiResponse" class="api-response">
            <h4>API Response:</h4>
            <pre>{{ apiResponse | json }}</pre>
          </div>
        </mat-card-content>
      </mat-card>


      <ng-template #loginTpl>
        <mat-card class="login-card fade-in">
          <mat-card-header>
            <mat-card-title>Not Authenticated</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Please login to explore the platform features. We use PKCE flow with OIDC.</p>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-raised-button color="primary" (click)="login()">
              <mat-icon>login</mat-icon> Login
            </button>
          </mat-card-actions>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 2rem auto; padding: 0 1rem; display: flex; flex-direction: column; gap: 1.5rem; }
    .spacer { flex: 1 1 auto; }
    .spinner-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
    .error-card { background: #fdecea; color: #d32f2f; padding: 1rem; border-radius: 4px; display: flex; align-items: center; gap: 0.5rem; border: 1px solid #ffcdd2; }
    .main-card, .testing-card, .login-card { margin-bottom: 1rem; }
    .user-avatar mat-icon { font-size: 40px; height: 40px; width: 40px; color: #3f51b5; }
    .claims-json { background: #263238; color: #80cbc4; padding: 1rem; border-radius: 4px; overflow: auto; font-family: 'Fira Code', monospace; max-height: 300px; }
    .test-buttons { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
    .actions { margin-top: 1.5rem; }
    .fade-in { animation: fadeIn 0.5s ease-in; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .btn-success { color: #2e7d32; border-color: #2e7d32; }
    .btn-success.mat-mdc-mini-fab { background-color: #2e7d32; color: white; border: none; }
    .btn-warning.mat-mdc-mini-fab { background-color: #ef6c00; color: white; }
    .toast-buttons { display: flex; gap: 0.5rem; align-items: center; }
    .toast-positions { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; }
    .toast-positions { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; }
    mat-divider { margin: 1rem 0; }
    .api-response { margin-top: 1rem; background: #f5f5f5; padding: 1rem; border-radius: 4px; max-height: 200px; overflow: auto; }
  `]
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);
  private inactivity = inject(InactivityService);
  private confirm = inject(ConfirmService);
  private tracker = inject(TrackerService);

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

  private alert = inject(AlertService);

  testConfirm() {
    this.tracker.track('ui_click', { button: 'testConfirm' });
    this.confirm.ask('Do you like this framework?', {
      title: 'Confirmation Request',
      type: 'info'
    }).subscribe(result => {
      this.alert.info(`You clicked ${result ? 'OK' : 'Cancel'}`);
    });
  }

  testAlert() {
    this.tracker.track('ui_click', { button: 'testAlert' });
    this.alert.success('Operation completed successfully!');
  }

  testError() {
    this.tracker.track('ui_click', { button: 'testError' });
    this.alert.error('Something went wrong. Please try again.');
  }

  private toast = inject(ToastService);

  testToast(type: ToastType = 'info', hPos?: any, vPos?: any) {
    this.toast.show(`This is a ${type} toast notification!`, {
      type,
      duration: 3000,
      horizontalPosition: hPos,
      verticalPosition: vPos
    });
  }

  private spinnerService = inject(SpinnerService);
  spinnerMessage = 'Processing...';

  testSpinner(type: string = 'square-jelly-box', message: string = 'Processing...') {
    this.spinnerMessage = message;
    this.spinnerService.show(undefined, {
      type: type,
      bdColor: 'rgba(0,0,0,0.85)',
      color: '#fff',
      size: 'medium'
    });

    setTimeout(() => {
      this.spinnerService.hide();
    }, 3000);
  }

  private testApi = inject(TestApiService);
  apiResponse: any;

  apiGetPosts() {
    this.apiResponse = 'Loading...';
    this.testApi.getPosts().subscribe({
      next: res => this.apiResponse = res.slice(0, 5), // Limit to 5
      error: err => this.apiResponse = err
    });
  }

  apiGetPost() {
    this.apiResponse = 'Loading...';
    this.testApi.getPost(1).subscribe({
      next: res => this.apiResponse = res,
      error: err => this.apiResponse = err
    });
  }

  apiError() {
    this.apiResponse = 'Loading...';
    this.testApi.getNonExistent().subscribe({
      next: res => this.apiResponse = res,
      error: err => this.apiResponse = err
    });
  }

  apiCreate() {
    this.apiResponse = 'Creating...';
    const newPost = { title: 'New Post', body: 'This is a new post', userId: 1 };
    this.testApi.createPost(newPost).subscribe({
      next: res => this.apiResponse = res,
      error: err => this.apiResponse = err
    });
  }

  apiUpdate() {
    this.apiResponse = 'Updating...';
    const update = { title: 'Updated Title' };
    this.testApi.updatePost(1, update).subscribe({
      next: res => this.apiResponse = res,
      error: err => this.apiResponse = err
    });
  }

  apiDelete() {
    this.apiResponse = 'Deleting...';
    this.testApi.deletePost(1).subscribe({
      next: () => this.apiResponse = 'Deleted successfully',
      error: err => this.apiResponse = err
    });
  }
}
