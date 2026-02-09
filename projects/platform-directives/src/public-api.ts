/*
 * Public API Surface of platform-directives
 */

// Shared
export * from './lib/shared';

// Auth
export * from './lib/auth/auth.store';
export * from './lib/auth/has-permission.directive';
export * from './lib/auth/has-role.directive';

// Loading
export * from './lib/loading/loading.store';
export * from './lib/loading/loading.directive';
export * from './lib/loading/disable-on-loading.directive';

// Interaction
export * from './lib/interaction/debounce-click.directive';
export * from './lib/interaction/confirm.directive';
export * from './lib/interaction/confirm.service';

// Forms
export * from './lib/forms/trim.directive';
export * from './lib/forms/numeric-only.directive';
export * from './lib/forms/uppercase.directive';
export * from './lib/forms/form-error.directive';

// Feature Flag
export * from './lib/feature-flag/feature.store';
export * from './lib/feature-flag/feature-enabled.directive';

// Analytics
export * from './lib/analytics/analytics.service';
export * from './lib/analytics/track-event.directive';

// Theme
export * from './lib/theme/theme.store';
export * from './lib/theme/theme-class.directive';
