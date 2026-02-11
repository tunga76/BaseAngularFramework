# Angular Enterprise UI Framework

A production-ready, modular, and themeable Angular UI library for enterprise applications.

## Features

- **Standalone Components**: All components are standalone and tree-shakable.
- **Signal-Based**: Uses Angular Signals for state management (Theme, Loading, etc.).
- **OnPush Change Detection**: High performance by default.
- **Theming**: CSS Variable based theming with Light/Dark mode support.
- **Accessibility**: ARIA compliant components.
- **Strict TypeScript**: Type-safe and robust.

## Usage

### 1. Import Styles

Add the styles to your `styles.scss` or `angular.json`:
```scss
// styles.scss
@import 'libs/ui-platform/src/lib/styles/tokens';
@import 'libs/ui-platform/src/lib/styles/typography';
@import 'libs/ui-platform/src/lib/styles/utilities';
```

### 2. Setup Theme

In your `AppComponent`:

```typescript
import { ThemeService, ThemeProviderComponent } from '@platform/ui-platform';

@Component({
  // ...
  imports: [ThemeProviderComponent],
  template: `
    <platform-theme-provider></platform-theme-provider>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(private themeService: ThemeService) {
    // Theme is auto-initialized based on system preference or local storage
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
```

### 3. Use Components

Import what you need:

```typescript
import { ButtonComponent, InputComponent, CardComponent } from '@platform/ui-platform';

@Component({
  standalone: true,
  imports: [ButtonComponent, InputComponent, CardComponent],
  template: `
    <platform-card>
      <platform-button variant="primary">Click Me</platform-button>
    </platform-card>
  `
})
```

## Architecture

- **Core**: Base classes and interfaces.
- **Components**: UI elements (Button, Input, etc.).
- **Services**: Global services (Toast, Modal, Loading).
- **Theme**: Theme management.
- **Layouts**: Page layouts (Dashboard, Fullscreen).

## Theming

Defined in `src/lib/styles/_tokens.scss`. Override CSS variables to customize.

```css
:root {
  --color-primary: #3b82f6;
  --radius-md: 8px;
}
```
