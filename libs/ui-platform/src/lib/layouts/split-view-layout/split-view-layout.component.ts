import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'platform-split-view-layout',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="split-container" [style.flex-direction]="direction === 'horizontal' ? 'row' : 'column'">
      <div class="pane first-pane" [style.flex]="'0 0 ' + firstPaneSize() + 'px'">
        <ng-content select="[left-pane]"></ng-content>
        <ng-content select="[top-pane]"></ng-content>
      </div>
      <div class="resizer" 
           [class.horizontal]="direction === 'horizontal'"
           [class.vertical]="direction === 'vertical'"
           (mousedown)="onMouseDown($event)">
      </div>
      <div class="pane second-pane">
        <ng-content select="[right-pane]"></ng-content>
        <ng-content select="[bottom-pane]"></ng-content>
      </div>
    </div>
  `,
    styles: [`
    .split-container {
      display: flex;
      height: 100vh;
      width: 100vw;
      background-color: var(--color-background);
      color: var(--color-text);
      overflow: hidden;
    }

    .pane {
      overflow: auto;
    }

    .first-pane {
      background-color: var(--color-surface);
      border-right: 1px solid var(--color-border);
    }

    .second-pane {
      flex: 1;
    }

    .resizer {
      background-color: var(--color-border);
      transition: background-color 0.2s;
      z-index: 10;
    }

    .resizer:hover {
      background-color: var(--color-primary);
    }

    .resizer.horizontal {
      width: 4px;
      cursor: col-resize;
    }

    .resizer.vertical {
      height: 4px;
      cursor: row-resize;
    }
  `]
})
export class SplitViewLayoutComponent {
    direction: 'horizontal' | 'vertical' = 'horizontal';
    firstPaneSize = signal(300);
    isResizing = false;

    onMouseDown(event: MouseEvent) {
        this.isResizing = true;
        event.preventDefault();
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (!this.isResizing) return;

        if (this.direction === 'horizontal') {
            this.firstPaneSize.set(event.clientX);
        } else {
            this.firstPaneSize.set(event.clientY);
        }
    }

    @HostListener('window:mouseup')
    onMouseUp() {
        this.isResizing = false;
        localStorage.setItem('split-pane-size', this.firstPaneSize().toString());
    }

    ngOnInit() {
        const savedSize = localStorage.getItem('split-pane-size');
        if (savedSize) {
            this.firstPaneSize.set(parseInt(savedSize, 10));
        }
    }
}
