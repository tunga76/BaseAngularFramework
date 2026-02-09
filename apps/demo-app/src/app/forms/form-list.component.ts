import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

interface FormSummary {
  id: string;
  name: string;
  fieldsCount: number;
  lastModified: string;
  status: 'Draft' | 'Published';
}

@Component({
  selector: 'app-form-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatDividerModule],
  template: `
    <div class="dashboard-container">
      <header class="page-header">
        <div>
          <h1>Form Management</h1>
          <p>Create and manage your dynamic enterprise forms</p>
        </div>
        <button mat-flat-button color="primary" routerLink="/form-builder">
          <mat-icon>add</mat-icon> Create New Form
        </button>
      </header>

      @if (loading) {
        <div class="loading-state">
          <p>Loading forms...</p>
        </div>
      } @else if (error) {
        <div class="error-state">
          <mat-icon color="warn">error</mat-icon>
          <p>{{ error }}</p>
        </div>
      } @else {
        <div class="forms-grid">
          @for (form of forms; track form.id) {
            <mat-card class="form-card">
              <mat-card-header>
                <div mat-card-avatar class="form-icon">
                  <mat-icon>description</mat-icon>
                </div>
                <mat-card-title>{{ form.name }}</mat-card-title>
                <mat-card-subtitle>Last modified: {{ form.lastModified }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="card-stats">
                  <mat-chip-listbox>
                    <mat-chip [color]="form.status === 'Published' ? 'accent' : 'default'">
                      {{ form.status }}
                    </mat-chip>
                    <mat-chip>{{ form.fieldsCount }} Fields</mat-chip>
                  </mat-chip-listbox>
                </div>
              </mat-card-content>
              <mat-divider></mat-divider>
              <mat-card-actions align="end">
                <button mat-button color="primary" [routerLink]="['/form-builder']" [queryParams]="{ id: form.id }">
                  <mat-icon>edit</mat-icon> EXECUTE BUILDER
                </button>
                <button mat-button color="accent" [routerLink]="['/form-preview']" [queryParams]="{ id: form.id }">
                  <mat-icon>visibility</mat-icon> PREVIEW
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }
    .page-header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 700;
      color: #1a237e;
    }
    .page-header p {
      margin: 8px 0 0;
      color: #546e7a;
      font-size: 16px;
    }
    .forms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }
    .form-card {
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(0,0,0,0.05);
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    .form-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.1);
    }
    .form-icon {
      background: #e8eaf6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3f51b5;
    }
    .card-stats {
      padding: 16px 0;
    }
    mat-card-actions {
      padding: 8px 16px;
    }
    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      text-align: center;
    }
    .error-state p {
      color: #f44336;
      margin-top: 8px;
    }
  `]
})
export class FormListComponent implements OnInit {
  private http = inject(HttpClient);

  forms: FormSummary[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit() {
    this.loadForms();
  }

  private loadForms() {
    this.loading = true;
    this.error = null;

    this.http.get<FormSummary[]>('./assets/forms/forms-list.json').subscribe({
      next: (data) => {
        this.forms = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading forms list:', err);
        this.error = 'Could not load form management data. Please ensure assets/forms/forms-list.json exists.';
        this.loading = false;
      }
    });
  }
}
