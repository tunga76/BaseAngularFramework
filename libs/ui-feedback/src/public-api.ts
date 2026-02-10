/*
 * Public API Surface of ui-feedback
 */

// Interfaces
export * from './lib/ui-interfaces';

// Configuration
export * from './lib/config/ui-config.interface';

// Internationalization
export * from './lib/i18n/ui-i18n.interface';

// Services
export * from './lib/browser-adapters';
export * from './lib/providers';
export * from './lib/platform-ui.service';
export * from './lib/material-ui.service';
export * from './lib/ngx-spinner-impl.service';
export * from './lib/security/ui-sanitizer.service';
export * from './lib/logging/ui-logger.service';

// Components (if needed for advanced usage)
export * from './lib/components/dialog.component';
export * from './lib/components/material-dialog.component';
export * from './lib/components/toast.component';
