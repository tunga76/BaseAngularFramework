import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'lib-material-loading',
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule],
    template: `
        <div class="loading-container">
            <mat-spinner mode="indeterminate"></mat-spinner>
        </div>
    `,
    styles: [`
        .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            min-height: 150px;
        }
    `]
})
export class MaterialLoadingComponent { }
