import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { FieldPaletteComponent } from './field-palette.component';
import { CanvasComponent } from './canvas.component';
import { FieldPropertiesPanelComponent } from './field-properties-panel.component';
import { BuilderStateService } from '../core/builder-state.service';
import { SchemaSerializerService } from '../core/schema-serializer.service';
import { SchemaFactoryService } from '../core/schema-factory.service';

@Component({
  selector: 'platform-form-builder',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    FieldPaletteComponent,
    CanvasComponent,
    FieldPropertiesPanelComponent
  ],
  template: `
    <div class="builder-layout">
      <mat-toolbar color="primary" class="builder-toolbar">
        <span class="brand">Platform Form Builder v2.0</span>
        <span class="spacer"></span>
        <button mat-button (click)="previewSchema()">
          <mat-icon>visibility</mat-icon> Preview JSON
        </button>
        <button mat-flat-button color="accent" (click)="saveSchema()" class="save-btn">
          <mat-icon>save</mat-icon> Save Schema
        </button>
      </mat-toolbar>

      <div class="builder-body">
        <aside class="left-sidebar">
          <platform-field-palette></platform-field-palette>
        </aside>

        <main class="center-canvas">
          <platform-canvas></platform-canvas>
        </main>

        <aside class="right-sidebar">
          <platform-field-properties-panel></platform-field-properties-panel>
        </aside>
      </div>

      @if (showJSON) {
        <div class="json-overlay" (click)="showJSON = false">
           <div class="json-content" (click)="$event.stopPropagation()">
              <div class="json-header">
                <h3>Generated Schema Output</h3>
                <button mat-icon-button (click)="showJSON = false"><mat-icon>close</mat-icon></button>
              </div>
              <pre>{{ schemaJSON }}</pre>
              <div class="json-actions">
                <button mat-raised-button color="primary" (click)="copyToClipboard()">Copy to Clipboard</button>
              </div>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .builder-layout {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 64px); /* Subtracting the main app toolbar height */
      width: 100%;
      overflow: hidden;
      font-family: 'Roboto', sans-serif;
      background: #fff;
    }
    .builder-toolbar {
      height: 64px;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .brand {
      font-weight: 700;
      letter-spacing: 1px;
    }
    .spacer { flex: 1 1 auto; }
    .save-btn { margin-left: 16px; }

    .builder-body {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .left-sidebar {
      width: 280px;
      flex-shrink: 0;
      z-index: 5;
    }

    .center-canvas {
      flex: 1;
      overflow: hidden;
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
    }

    .right-sidebar {
      width: 350px;
      flex-shrink: 0;
      z-index: 5;
    }

    .json-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .json-content {
      background: #fff;
      width: 80%;
      height: 80%;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    .json-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .json-content pre {
      flex: 1;
      overflow: auto;
      background: #263238;
      color: #80cbc4;
      padding: 20px;
      border-radius: 8px;
      font-size: 14px;
    }
    .json-actions {
      margin-top: 16px;
      text-align: right;
    }
  `]
})
export class FormBuilderComponent {
  state = inject(BuilderStateService);
  serializer = inject(SchemaSerializerService);
  factory = inject(SchemaFactoryService);

  showJSON = false;
  schemaJSON = '';

  previewSchema() {
    const builderSchema = this.state.schema();
    const engineSchema = this.factory.toFormEngineSchema(builderSchema);
    this.schemaJSON = JSON.stringify(engineSchema, null, 2);
    this.showJSON = true;
  }

  saveSchema() {
    this.serializer.download(this.state.schema());
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.schemaJSON);
  }
}
