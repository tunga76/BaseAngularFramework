import { Component, Input, Output, EventEmitter, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Dropdown menu component with keyboard navigation.
 * 
 * Features:
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Auto-close on outside click
 * - Customizable trigger
 * - Multiple menu items
 * - Dividers support
 * 
 * @example
 * ```html
 * <platform-dropdown>
 *   <button dropdown-trigger>Menu</button>
 *   <div dropdown-content>
 *     <button class="dropdown-item">Profile</button>
 *     <button class="dropdown-item">Settings</button>
 *     <hr class="dropdown-divider">
 *     <button class="dropdown-item">Logout</button>
 *   </div>
 * </platform-dropdown>
 * ```
 */
@Component({
    selector: 'platform-dropdown',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dropdown" [class.open]="isOpen()">
      <div 
        class="dropdown-trigger"
        (click)="toggle()"
        (keydown.enter)="toggle()"
        (keydown.space)="toggle(); $event.preventDefault()"
        tabindex="0"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="true">
        <ng-content select="[dropdown-trigger]"></ng-content>
      </div>

      <div 
        *ngIf="isOpen()"
        class="dropdown-menu"
        [class]="'dropdown-' + position"
        role="menu"
        (keydown)="handleKeydown($event)">
        <ng-content select="[dropdown-content]"></ng-content>
      </div>
    </div>
  `,
    styles: [`
    .dropdown {
      position: relative;
      display: inline-block;
    }

    .dropdown-trigger {
      cursor: pointer;
    }

    .dropdown-trigger:focus-visible {
      outline: 2px solid var(--color-primary, #3b82f6);
      outline-offset: 2px;
      border-radius: var(--radius-md, 4px);
    }

    .dropdown-menu {
      position: absolute;
      min-width: 200px;
      background-color: var(--color-surface, #ffffff);
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
                  0 4px 6px -2px rgba(0, 0, 0, 0.05);
      padding: 8px 0;
      z-index: 1000;
      animation: slideDown 0.2s ease;
    }

    .dropdown-bottom {
      top: calc(100% + 8px);
      left: 0;
    }

    .dropdown-top {
      bottom: calc(100% + 8px);
      left: 0;
    }

    .dropdown-right {
      top: 0;
      left: calc(100% + 8px);
    }

    .dropdown-left {
      top: 0;
      right: calc(100% + 8px);
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    :host ::ng-deep .dropdown-item {
      width: 100%;
      padding: 10px 16px;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      font-family: inherit;
      font-size: var(--font-size-md, 14px);
      color: var(--color-text, #374151);
      transition: all var(--transition-fast, 0.15s ease);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    :host ::ng-deep .dropdown-item:hover {
      background-color: var(--color-background, #f9fafb);
    }

    :host ::ng-deep .dropdown-item:focus-visible {
      outline: none;
      background-color: var(--color-background, #f9fafb);
    }

    :host ::ng-deep .dropdown-divider {
      margin: 4px 0;
      border: none;
      border-top: 1px solid var(--color-border, #e5e7eb);
    }
  `]
})
export class DropdownComponent {
    /** Dropdown position relative to trigger */
    @Input() position: 'bottom' | 'top' | 'left' | 'right' = 'bottom';

    /** Emitted when dropdown opens */
    @Output() onOpen = new EventEmitter<void>();

    /** Emitted when dropdown closes */
    @Output() onClose = new EventEmitter<void>();

    isOpen = signal(false);

    toggle(): void {
        this.isOpen.update(open => {
            const newState = !open;
            if (newState) {
                this.onOpen.emit();
            } else {
                this.onClose.emit();
            }
            return newState;
        });
    }

    close(): void {
        if (this.isOpen()) {
            this.isOpen.set(false);
            this.onClose.emit();
        }
    }

    @HostListener('window:click', ['$event'])
    onWindowClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (this.isOpen() && !target.closest('.dropdown')) {
            this.close();
        }
    }

    @HostListener('window:keydown.escape')
    onEscape(): void {
        this.close();
    }

    handleKeydown(event: KeyboardEvent): void {
        const items = Array.from(
            (event.currentTarget as HTMLElement).querySelectorAll('.dropdown-item')
        ) as HTMLElement[];

        const currentIndex = items.indexOf(document.activeElement as HTMLElement);

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                items[nextIndex]?.focus();
                break;
            case 'ArrowUp':
                event.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                items[prevIndex]?.focus();
                break;
            case 'Home':
                event.preventDefault();
                items[0]?.focus();
                break;
            case 'End':
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
        }
    }
}
