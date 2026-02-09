import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BuilderField } from '../models';
import { BuilderStateService } from '../core/builder-state.service';
import { SchemaFactoryService } from '../core/schema-factory.service';

@Component({
    selector: 'platform-canvas',
    standalone: true,
    imports: [CommonModule, DragDropModule, MatIconModule, MatButtonModule],
    template: `
    <div class="canvas-wrapper">
      <div class="canvas-header">
        <span class="schema-title">{{ state.schema().title }}</span>
        <div class="actions">
          <button mat-icon-button (click)="state.undo()" [disabled]="!state.canUndo()" title="Undo">
            <mat-icon>undo</mat-icon>
          </button>
          <button mat-icon-button (click)="state.redo()" [disabled]="!state.canRedo()" title="Redo">
            <mat-icon>redo</mat-icon>
          </button>
        </div>
      </div>

      <div
        id="canvas"
        cdkDropList
        [cdkDropListData]="state.fields()"
        (cdkDropListDropped)="onDrop($event)"
        class="canvas-area"
        [class.empty]="state.fields().length === 0">
        
        @if (state.fields().length === 0) {
          <div class="empty-state">
            <mat-icon>add_circle_outline</mat-icon>
            <p>Drag and drop components here to build your form</p>
          </div>
        }

        <div class="grid-container">
          @for (field of state.fields(); track field.id) {
            <div
              cdkDrag
              class="field-node col-{{field.ui.colSpan?.md || 12}}"
              [class.selected]="state.selectedFieldId() === field.id"
              (click)="state.selectField(field.id); $event.stopPropagation()">
              
              <div class="field-node-content">
                <div class="drag-handle" cdkDragHandle>
                  <mat-icon>drag_indicator</mat-icon>
                </div>
                
                <div class="field-preview">
                  <span class="field-label">{{ field.label }}</span>
                  <span class="field-type-tag">{{ field.type }}</span>
                  
                  @if (field.type === 'divider') {
                    <hr class="preview-divider">
                  } @else if (field.type === 'section') {
                    <div class="preview-section">Section Content Container</div>
                  } @else {
                     <div class="preview-input">
                       {{ field.ui.placeholder || 'Sample value...' }}
                     </div>
                  }
                </div>

                <div class="node-actions">
                  <button mat-icon-button color="warn" (click)="state.removeField(field.id); $event.stopPropagation()">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
    styles: [`
    .canvas-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #f0f2f5;
    }
    .canvas-header {
      padding: 12px 24px;
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .schema-title {
      font-weight: 600;
      color: #263238;
      font-size: 16px;
    }
    .canvas-area {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      min-height: 400px;
    }
    .canvas-area.empty {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .empty-state {
      text-align: center;
      color: #90a4ae;
    }
    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }
    .grid-container {
      display: flex;
      flex-wrap: wrap;
      margin: -10px;
    }
    .field-node {
      padding: 10px;
      position: relative;
    }
    .field-node-content {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: flex-start;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .field-node.selected .field-node-content {
      border-color: #3f51b5;
      background: #f8f9ff;
      box-shadow: 0 8px 24px rgba(63, 81, 181, 0.12);
    }
    .field-node-content::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: #3f51b5;
      transform: scaleY(0);
      transition: transform 0.2s ease;
    }
    .field-node.selected .field-node-content::before {
      transform: scaleY(1);
    }
    .field-node:hover .field-node-content {
      border-color: #c5cae9;
    }
    .drag-handle {
      margin-right: 12px;
      color: #b0bec5;
      cursor: move;
    }
    .field-preview {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .field-label {
      font-weight: 600;
      font-size: 14px;
      color: #37474f;
      margin-bottom: 4px;
    }
    .field-type-tag {
      font-size: 10px;
      text-transform: uppercase;
      color: #78909c;
      background: #eceff1;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
      width: fit-content;
      margin-bottom: 8px;
    }
    .preview-input {
      border: 1px dashed #cfd8dc;
      padding: 8px;
      color: #90a4ae;
      font-size: 13px;
      border-radius: 4px;
    }
    .node-actions {
      opacity: 0;
      transition: opacity 0.2s;
    }
    .field-node:hover .node-actions, .field-node.selected .node-actions {
      opacity: 1;
    }

    /* Grid helper classes (Simplified) */
    .col-12 { width: 100%; }
    .col-6 { width: 50%; }
    .col-4 { width: 33.33%; }
    .col-3 { width: 25%; }

    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 8px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }
    .cdk-drag-placeholder {
      opacity: 0.3;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .canvas-area.cdk-drop-list-dragging .field-node:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class CanvasComponent {
    state = inject(BuilderStateService);
    factory = inject(SchemaFactoryService);

    onDrop(event: CdkDragDrop<BuilderField[]>) {
        // If coming from another list (palette)
        if (event.previousContainer !== event.container) {
            const type = event.item.data as string;
            const newField = this.factory.createField(type);
            this.state.addField(newField, event.currentIndex);
        } else {
            // Reordering
            const fields = [...this.state.fields()];
            moveItemInArray(fields, event.previousIndex, event.currentIndex);
            this.state.reorderFields(fields);
        }
    }
}
