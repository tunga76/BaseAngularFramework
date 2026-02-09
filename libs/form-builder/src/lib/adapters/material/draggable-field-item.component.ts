import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FieldType } from '../../models';

@Component({
    selector: 'platform-draggable-field-item',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    template: `
    <div class="field-item" [attr.data-type]="type">
      <mat-icon>{{ getIcon() }}</mat-icon>
      <span>{{ label }}</span>
    </div>
  `,
    styles: [`
    .field-item {
      display: flex;
      align-items: center;
      padding: 12px;
      margin-bottom: 8px;
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      cursor: grab;
      transition: all 0.2s ease;
      user-select: none;
      color: #333;
    }

    .field-item:hover {
      border-color: #3f51b5;
      background: #f5f6ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }

    .field-item mat-icon {
      margin-right: 12px;
      color: #757575;
    }

    .field-item:hover mat-icon {
      color: #3f51b5;
    }

    span {
      font-weight: 500;
      font-size: 14px;
    }
  `]
})
export class DraggableFieldItemComponent {
    @Input() type!: FieldType;
    @Input() label!: string;

    getIcon(): string {
        switch (this.type) {
            case 'text': return 'text_fields';
            case 'password': return 'lock';
            case 'select': return 'arrow_drop_down_circle';
            case 'date': return 'calendar_month';
            case 'checkbox': return 'check_box';
            case 'divider': return 'horizontal_rule';
            case 'section': return 'view_quilt';
            default: return 'widgets';
        }
    }
}
