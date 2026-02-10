import { Component, HostListener, signal, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Split view layout with resizable panes.
 * 
 * Provides a two-pane layout with an interactive resizer between them.
 * Supports both horizontal (left/right) and vertical (top/bottom) orientations.
 * 
 * Accessibility features:
 * - Keyboard resizing with arrow keys
 * - ARIA separator role with value attributes
 * - Focusable resizer
 * - Min/max pane size constraints
 * 
 * Features:
 * - Mouse drag to resize
 * - Keyboard navigation (arrow keys)
 * - Size persistence in localStorage
 * - Responsive constraints
 * 
 * @example
 * ```html
 * <platform-split-view-layout>
 *   <div left-pane>
 *     <h2>File Browser</h2>
 *   </div>
 *   <div right-pane>
 *     <h2>Editor</h2>
 *   </div>
 * </platform-split-view-layout>
 * ```
 */
@Component({
  selector: 'platform-split-view-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="split-container" [style.flex-direction]="direction === 'horizontal' ? 'row' : 'column'">
      <div class="pane first-pane" 
           [style.flex]="'0 0 ' + firstPaneSize() + 'px'"
           role="region"
           [attr.aria-label]="direction === 'horizontal' ? 'Left pane' : 'Top pane'">
        <ng-content select="[left-pane]"></ng-content>
        <ng-content select="[top-pane]"></ng-content>
      </div>
      
      <div class="resizer" 
           [class.horizontal]="direction === 'horizontal'"
           [class.vertical]="direction === 'vertical'"
           role="separator"
           tabindex="0"
           [attr.aria-label]="getResizerLabel()"
           [attr.aria-valuenow]="firstPaneSize()"
           [attr.aria-valuemin]="minSize"
           [attr.aria-valuemax]="maxSize"
           [attr.aria-orientation]="direction"
           (mousedown)="onMouseDown($event)"
           (keydown)="onKeyDown($event)">
        <span class="resize-handle" aria-hidden="true"></span>
      </div>
      
      <div class="pane second-pane"
           role="region"
           [attr.aria-label]="direction === 'horizontal' ? 'Right pane' : 'Bottom pane'">
        <ng-content select="[right-pane]"></ng-content>
        <ng-content select="[bottom-pane]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .split-container {
      display: flex;
      height: 100%;
      width: 100%;
      background-color: var(--color-background, #ffffff);
      color: var(--color-text, #111827);
      overflow: hidden;
    }

    .pane {
      overflow: auto;
      min-width: 0;
      min-height: 0;
    }

    .first-pane {
      background-color: var(--color-surface, #f9fafb);
      border-right: 1px solid var(--color-border, #e5e7eb);
    }

    .split-container[style*="column"] .first-pane {
      border-right: none;
      border-bottom: 1px solid var(--color-border, #e5e7eb);
    }

    .second-pane {
      flex: 1;
    }

    .resizer {
      background-color: var(--color-border, #e5e7eb);
      transition: background-color 0.2s;
      z-index: 10;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .resizer:hover,
    .resizer:focus-visible {
      background-color: var(--color-primary, #3b82f6);
    }

    .resizer:focus-visible {
      outline: 2px solid var(--color-primary, #3b82f6);
      outline-offset: -2px;
    }

    .resizer.horizontal {
      width: 4px;
      cursor: col-resize;
      flex-direction: column;
    }

    .resizer.vertical {
      height: 4px;
      cursor: row-resize;
      flex-direction: row;
    }

    .resize-handle {
      background-color: currentColor;
      border-radius: 2px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .resizer.horizontal .resize-handle {
      width: 2px;
      height: 40px;
    }

    .resizer.vertical .resize-handle {
      width: 40px;
      height: 2px;
    }

    .resizer:hover .resize-handle,
    .resizer:focus .resize-handle {
      opacity: 1;
    }

    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
  `]
})
export class SplitViewLayoutComponent implements OnInit {
  /**
   * Direction of the split.
   * @default 'horizontal'
   */
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * Initial size of the first pane in pixels.
   * @default 300
   */
  @Input() initialSize = 300;

  /**
   * Minimum size of the first pane in pixels.
   * @default 200
   */
  @Input() minSize = 200;

  /**
   * Maximum size of the first pane in pixels.
   * @default 800
   */
  @Input() maxSize = 800;

  /**
   * Key for localStorage persistence.
   * If not provided, size won't be persisted.
   */
  @Input() storageKey?: string;

  /**
   * Step size for keyboard resizing in pixels.
   * @default 10
   */
  @Input() keyboardStep = 10;

  /** Current size of the first pane (reactive signal) */
  firstPaneSize = signal(300);

  /** Whether mouse drag is active */
  isResizing = false;

  ngOnInit(): void {
    // Load saved size from localStorage
    if (this.storageKey) {
      const savedSize = localStorage.getItem(this.storageKey);
      if (savedSize) {
        const parsedSize = parseInt(savedSize, 10);
        this.firstPaneSize.set(this.constrainSize(parsedSize));
        return;
      }
    }

    // Use initial size if no saved size
    this.firstPaneSize.set(this.constrainSize(this.initialSize));
  }

  /**
   * Handles mouse down on resizer - starts drag operation.
   */
  onMouseDown(event: MouseEvent): void {
    this.isResizing = true;
    event.preventDefault();
  }

  /**
   * Handles mouse move - updates pane size during drag.
   */
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isResizing) return;

    const newSize = this.direction === 'horizontal'
      ? event.clientX
      : event.clientY;

    this.firstPaneSize.set(this.constrainSize(newSize));
  }

  /**
   * Handles mouse up - ends drag operation and saves size.
   */
  @HostListener('window:mouseup')
  onMouseUp(): void {
    if (this.isResizing) {
      this.isResizing = false;
      this.saveSize();
    }
  }

  /**
   * Handles keyboard navigation for resizing.
   * Arrow keys adjust the pane size.
   * 
   * - ArrowLeft/ArrowUp: Decrease size
   * - ArrowRight/ArrowDown: Increase size
   */
  onKeyDown(event: KeyboardEvent): void {
    const { key } = event;
    let change = 0;

    if (this.direction === 'horizontal') {
      if (key === 'ArrowLeft') change = -this.keyboardStep;
      if (key === 'ArrowRight') change = this.keyboardStep;
    } else {
      if (key === 'ArrowUp') change = -this.keyboardStep;
      if (key === 'ArrowDown') change = this.keyboardStep;
    }

    if (change !== 0) {
      event.preventDefault();
      const newSize = this.firstPaneSize() + change;
      this.firstPaneSize.set(this.constrainSize(newSize));
      this.saveSize();
    }
  }

  /**
   * Constrains size to min/max bounds.
   */
  private constrainSize(size: number): number {
    return Math.max(this.minSize, Math.min(this.maxSize, size));
  }

  /**
   * Saves current size to localStorage if storageKey is provided.
   */
  private saveSize(): void {
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, this.firstPaneSize().toString());
    }
  }

  /**
   * Gets descriptive ARIA label for the resizer.
   */
  getResizerLabel(): string {
    const orientation = this.direction === 'horizontal' ? 'horizontal' : 'vertical';
    return `${orientation} resize handle. Use arrow keys to adjust size`;
  }

  /**
   * Programmatically sets the pane size.
   * Useful for preset layouts or responsive breakpoints.
   * 
   * @param size - New size in pixels
   */
  public setSize(size: number): void {
    this.firstPaneSize.set(this.constrainSize(size));
    this.saveSize();
  }

  /**
   * Resets to initial size.
   */
  public reset(): void {
    this.setSize(this.initialSize);
  }
}
