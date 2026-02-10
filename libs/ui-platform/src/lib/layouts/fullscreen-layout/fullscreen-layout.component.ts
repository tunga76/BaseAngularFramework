import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Fullscreen layout component that fills the entire viewport.
 * 
 * Provides a simple, full-screen container for content.
 * Commonly used for:
 * - Login/authentication pages
 * - Splash screens
 * - Landing pages
 * - Presentation modes
 * 
 * @example
 * ```html
 * <platform-fullscreen-layout>
 *   <div class="login-container">
 *     <h1>Welcome</h1>
 *     <form>
 *       <!-- Login form -->
 *     </form>
 *   </div>
 * </platform-fullscreen-layout>
 * ```
 */
@Component({
  selector: 'platform-fullscreen-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fullscreen-container" role="main">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .fullscreen-container {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--color-background, #ffffff);
      color: var(--color-text, #111827);
      overflow: auto;
    }

    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
  `]
})
export class FullScreenLayoutComponent { }
