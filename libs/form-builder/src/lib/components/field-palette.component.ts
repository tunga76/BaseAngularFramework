import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { DraggableFieldItemComponent } from '../adapters/material/draggable-field-item.component';
import { FieldType } from '../models';

interface PaletteItem {
    type: FieldType;
    label: string;
}

@Component({
    selector: 'platform-field-palette',
    standalone: true,
    imports: [CommonModule, CdkDrag, CdkDropList, DraggableFieldItemComponent],
    template: `
    <div class="palette-container">
      <h3 class="palette-title">Components</h3>
      <div
        cdkDropList
        [cdkDropListData]="items"
        [cdkDropListConnectedTo]="['canvas']"
        class="palette-list"
        [cdkDropListSortingDisabled]="true">
        @for (item of items; track item.type) {
          <platform-draggable-field-item
            cdkDrag
            [cdkDragData]="item.type"
            [type]="item.type"
            [label]="item.label">
          </platform-draggable-field-item>
        }
      </div>
    </div>
  `,
    styles: [`
    .palette-container {
      padding: 16px;
      height: 100%;
      background: #f8f9fa;
      border-right: 1px solid #e0e0e0;
    }
    .palette-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #37474f;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .palette-list {
      display: flex;
      flex-direction: column;
    }
  `]
})
export class FieldPaletteComponent {
    items: PaletteItem[] = [
        { type: 'text', label: 'Text Input' },
        { type: 'password', label: 'Password' },
        { type: 'select', label: 'Dropdown' },
        { type: 'date', label: 'Date Picker' },
        { type: 'checkbox', label: 'Checkbox' },
        { type: 'divider', label: 'Divider' },
        { type: 'section', label: 'Section' }
    ];
}
