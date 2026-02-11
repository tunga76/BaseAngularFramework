import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'platform-table',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="table-container" [class.bordered]="bordered">
      <table class="table">
        <thead class="table-header">
           <ng-content select="thead"></ng-content>
        </thead>
        <tbody class="table-body">
           <ng-content select="tbody"></ng-content>
        </tbody>
        <tfoot *ngIf="hasFooter" class="table-footer">
           <ng-content select="tfoot"></ng-content>
        </tfoot>
      </table>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
      overflow-x: auto;
    }
    .table-container {
      width: 100%;
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .table-container.bordered {
      border: 1px solid var(--color-border);
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: var(--text-sm);
    }
    
    ::ng-deep .table th, ::ng-deep .table td {
      padding: var(--spacing-3) var(--spacing-4);
      border-bottom: 1px solid var(--color-border);
    }

    ::ng-deep .table th {
      background-color: var(--color-surface-50);
      font-weight: var(--font-semibold);
      color: var(--color-text-secondary);
      text-transform: uppercase;
      font-size: var(--text-xs);
      letter-spacing: 0.05em;
    }

    ::ng-deep .table tr:last-child td {
      border-bottom: none;
    }

    ::ng-deep .table tbody tr:hover {
      background-color: var(--color-surface-50);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
    @Input() bordered = true;
    get hasFooter() { return true; } // Assumes user provides tfoot if needed
}
