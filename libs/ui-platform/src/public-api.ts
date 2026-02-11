/*
 * Public API Surface of ui-platform
 */

// Core
export * from './lib/core/base-component';

// Services
export * from './lib/services/layout-registry.service'; // Existing
export * from './lib/theme/theme.service';
export * from './lib/theme/theme-provider.component';
export * from './lib/services/modal.service';
export * from './lib/services/global-loading.service';
export * from './lib/components/toast/toast.component'; // Export ToastService and components
export * from './lib/components/confirm-dialog/confirm-dialog.component'; // Export ConfirmDialogService

// Layouts
export * from './lib/layouts/dashboard-layout/dashboard-layout.component';
export * from './lib/layouts/fullscreen-layout/fullscreen-layout.component';
export * from './lib/layouts/split-view-layout/split-view-layout.component';

// Components
export * from './lib/components/button/button.component';
export * from './lib/components/input/input.component';
export * from './lib/components/form-field/form-field.component';
export * from './lib/components/card/card.component';
export * from './lib/components/badge/badge.component';
export * from './lib/components/chip/chip.component';
export * from './lib/components/spinner/spinner.component';
export * from './lib/components/modal/modal.component';
export * from './lib/components/dropdown/dropdown.component';
export * from './lib/components/loading/loading-bar.component';
export * from './lib/components/alert/alert.component';
export * from './lib/components/table/table.component';

// Directives
export * from './lib/directives/validation.directive';

// Pipes
export * from './lib/pipes/error-message.pipe';
