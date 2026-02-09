import { Type } from '@angular/core';

export interface PopupOptions {
    type?: 'alert' | 'confirm' | 'custom';
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    width?: string;
    closable?: boolean;
}

export interface ModalInstance {
    component: Type<any>;
    options: PopupOptions;
    resolve: (result: any) => void;
    id: string;
}
