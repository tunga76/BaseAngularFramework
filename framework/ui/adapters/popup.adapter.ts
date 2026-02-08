export interface PopupAdapter {
    showError(message: string, title?: string): void;
    showSuccess(message: string, title?: string): void;
    showInfo(message: string, title?: string): void;
    showWarning(message: string, title?: string): void;
}
