import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { TestApiService, Post } from '../../api/test-api.service';

@Component({
  selector: 'app-api-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <h2>API Client Test Console</h2>
      <p class="desc">
        Demonstrating <code>ApiClient</code> capabilities using 
        <a href="https://jsonplaceholder.typicode.com" target="_blank">JSONPlaceholder</a> 
        and <a href="https://httpstat.us" target="_blank">httpstat.us</a>.
      </p>
      
      <div class="grid-layout">
        <div class="card actions-card">
          <h3>Operations</h3>
          
          <div class="section">
            <h4>Reads (GET)</h4>
            <div class="button-group">
              <button (click)="getPosts()" class="btn primary">Get All Posts</button>
              <button (click)="getPost(1)" class="btn primary">Get Post #1</button>
            </div>
          </div>

          <div class="section">
            <h4>Writes</h4>
            <div class="button-group">
              <button (click)="createPost()" class="btn success">Create Post (POST)</button>
              <button (click)="updatePost()" class="btn warning">Update Post (PUT)</button>
              <button (click)="patchPost()" class="btn warning">Patch Post (PATCH)</button>
              <button (click)="deletePost()" class="btn error">Delete Post (DELETE)</button>
            </div>
          </div>

          <div class="section">
            <h4>Error Handling</h4>
            <div class="button-group">
              <button (click)="simulateError(404)" class="btn secondary">404 Not Found</button>
              <button (click)="simulateError(500)" class="btn secondary">500 Server Error</button>
              <button (click)="simulateError(400)" class="btn secondary">400 Bad Request</button>
              <button (click)="simulateError(401)" class="btn secondary">401 Unauthorized</button>
              <button (click)="simulateError(403)" class="btn secondary">403 Forbidden</button>
            </div>
          </div>
        </div>

        <div class="card result-card">
          <div class="card-header">
            <h3>Response</h3>
            <span *ngIf="lastAction()" class="badge">{{ lastAction() }}</span>
          </div>

          <div *ngIf="isLoading()" class="loading-state">
            <div class="spinner"></div>
            <span>Sending Request...</span>
          </div>
          
          <div *ngIf="!isLoading() && lastResult()" [class.error-state]="lastResult()?.error">
             <div class="status-bar" [ngClass]="lastResult()?.error ? 'bg-error' : 'bg-success'">
               Status: {{ lastResult()?.status || (lastResult()?.error ? 'Failed' : 'Success') }}
             </div>
             <pre>{{ lastResult()?.data | json }}</pre>
          </div>

          <div *ngIf="!isLoading() && !lastResult()" class="empty-state">
            Select an operation to see the result here.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .desc { color: #64748b; margin-bottom: 24px; }
    .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    
    @media (max-width: 768px) {
      .grid-layout { grid-template-columns: 1fr; }
    }

    .card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    h3 { margin: 0 0 16px 0; color: #0f172a; font-size: 1.25rem; }
    h4 { margin: 0 0 12px 0; color: #475569; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
    
    .section { margin-bottom: 24px; }
    .section:last-child { margin-bottom: 0; }

    .button-group { display: flex; gap: 10px; flex-wrap: wrap; }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    .btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn:active { transform: translateY(0); }

    .primary { background: #3b82f6; color: white; }
    .success { background: #22c55e; color: white; }
    .warning { background: #f59e0b; color: white; }
    .error { background: #ef4444; color: white; }
    .secondary { background: #64748b; color: white; }

    .badge {
      background: #f1f5f9;
      color: #475569;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #64748b;
    }
    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      animation: spin 1s linear infinite;
      margin-bottom: 12px;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    .result-card pre {
      background: #f8fafc;
      padding: 16px;
      border-radius: 8px;
      overflow: auto;
      max-height: 500px;
      font-size: 0.875rem;
      border: 1px solid #e2e8f0;
      color: #334155;
    }

    .status-bar {
      padding: 8px 12px;
      border-radius: 6px;
      margin-bottom: 12px;
      font-weight: 600;
      color: white;
    }
    .bg-success { background: #22c55e; }
    .bg-error { background: #ef4444; }
    
    .error-state pre { border-color: #fca5a5; background: #fef2f2; }
    
    .empty-state {
      color: #94a3b8;
      text-align: center;
      padding: 40px;
      font-style: italic;
    }
  `]
})
export class ApiDemoComponent {
  private testApi = inject(TestApiService);

  isLoading = signal(false);
  lastResult = signal<any>(null);
  lastAction = signal<string>('');

  getPosts() {
    this.executeRequest('GET All Posts', this.testApi.getPosts());
  }

  getPost(id: number) {
    this.executeRequest(`GET Post #${id}`, this.testApi.getPost(id));
  }

  createPost() {
    const newPost = {
      title: 'New Post via Angular',
      body: 'This post was created utilizing the Core ApiClient.',
      userId: 1
    };
    this.executeRequest('POST Create', this.testApi.createPost(newPost));
  }

  updatePost() {
    const updatedPost: Post = {
      id: 1,
      title: 'Updated Post Title',
      body: 'Updated body content.',
      userId: 1
    };
    this.executeRequest('PUT Update', this.testApi.updatePost(1, updatedPost));
  }

  patchPost() {
    this.executeRequest('PATCH Partial Update', this.testApi.patchPost(1, { title: 'Patched Title Only' }));
  }

  deletePost() {
    this.executeRequest('DELETE Post', this.testApi.deletePost(1));
  }

  simulateError(status: number) {
    this.executeRequest(`Error Simulation ${status}`, this.testApi.simulateError(status));
  }

  private executeRequest(action: string, observable: any) {
    this.isLoading.set(true);
    this.lastResult.set(null);
    this.lastAction.set(action);

    observable.pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (res: any) => {
        this.lastResult.set({ status: '200 OK', data: res }); // jsonplaceholder usually returns 200/201
      },
      error: (err: any) => {
        console.error('API Error:', err);
        this.lastResult.set({
          error: true,
          status: `${err.status} ${err.statusText}`,
          data: err.error || err.message
        });
      }
    });
  }
}
