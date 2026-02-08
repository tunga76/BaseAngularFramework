import { InjectionToken } from '@angular/core';
import { AppPlatformConfig } from '../config/framework-config';
import { PopupAdapter } from '../ui/adapters/popup.adapter';
import { ModalAdapter } from '../ui/adapters/modal.adapter';
import { LoadingAdapter } from '../ui/adapters/loading.adapter';

export const APP_PLATFORM_CONFIG = new InjectionToken<AppPlatformConfig>('APP_PLATFORM_CONFIG');
export const POPUP_ADAPTER = new InjectionToken<PopupAdapter>('POPUP_ADAPTER');
export const MODAL_ADAPTER = new InjectionToken<ModalAdapter>('MODAL_ADAPTER');
export const LOADING_ADAPTER = new InjectionToken<LoadingAdapter>('LOADING_ADAPTER');
