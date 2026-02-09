import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DynamicFormRendererComponent } from '@platform/form-builder';

@Component({
  selector: 'app-form-preview',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, DynamicFormRendererComponent],
  template: `
    <div class="preview-container">
      <header class="preview-header">
        <button mat-icon-button routerLink="/forms">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ formName }} - Live Preview</h1>
      </header>

      <div class="preview-content">
        @if (sampleSchema) {
          <div class="card shadow">
            <platform-dynamic-form-renderer [schema]="sampleSchema"></platform-dynamic-form-renderer>
          </div>
        } @else if (loading) {
          <div class="loading-state">
            <p>Loading form schema...</p>
          </div>
        } @else if (error) {
          <div class="error-state">
            <mat-icon color="warn">error</mat-icon>
            <p>{{ error }}</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .preview-container {
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .preview-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 30px;
    }
    .preview-header h1 {
      margin: 0;
      font-size: 24px;
      color: #1a237e;
    }
    .preview-content {
      background: #fdfdfd;
      min-height: 200px;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #eee;
    }
    .shadow {
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }
    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      text-align: center;
    }
    .error-state p {
      color: #f44336;
      margin-top: 8px;
    }
  `]
})
export class FormPreviewComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  formName = 'Loading...';
  sampleSchema: any = null;
  loading = true;
  error: string | null = null;

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('id') || '1';
    this.loadFormSchema(id);
  }

  private loadFormSchema(id: string) {
    this.loading = true;
    this.error = null;

    this.http.get(`./assets/forms/form-${id}.json`).subscribe({
      next: (schema: any) => {
        this.sampleSchema = schema;
        this.formName = schema.title || schema.name || 'Untitled Form';
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading form schema:', err);
        this.error = `Could not load form schema for ID: ${id}. Please ensure assets/forms/form-${id}.json exists.`;
        this.loading = false;
        this.formName = 'Error';
      }
    });
  }
}
