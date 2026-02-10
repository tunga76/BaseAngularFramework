import { Injectable, ApplicationRef, createComponent, EnvironmentInjector, ComponentRef, inject, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Subject, Observable, throwError } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { DialogComponent } from './components/dialog.component';
import { ToastComponent } from './components/toast.component';
import { ConfirmOptions, ConfirmService, AlertService, ToastService, ToastOptions } from './ui-interfaces';
import { UiLoggerService } from './logging/ui-logger.service';

@Injectable({
    providedIn: 'root'
})
export class PlatformUiService implements ConfirmService, AlertService, ToastService, OnDestroy {
    private appRef = inject(ApplicationRef);
    private injector = inject(EnvironmentInjector);
    private logger = inject(UiLoggerService);
    private document = inject(DOCUMENT);
    private platformId = inject(PLATFORM_ID);

    private destroy$ = new Subject<void>();

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ask(message: string, options?: ConfirmOptions): Observable<boolean> {
        if (!isPlatformBrowser(this.platformId)) {
            this.logger.logWarning('PlatformUiService.ask', 'Dialog not supported in SSR');
            return throwError(() => new Error('Dialog not supported in SSR'));
        }

        try {
            const result$ = new Subject<boolean>();

            const componentRef = createComponent(DialogComponent, {
                environmentInjector: this.injector
            });

            componentRef.instance.message = message;
            componentRef.instance.title = options?.title || 'Confirm';
            componentRef.instance.type = options?.type || 'info';
            componentRef.instance.confirmText = options?.confirmText || 'Yes';
            componentRef.instance.cancelText = options?.cancelText || 'No';
            componentRef.instance.showCancel = true;
            componentRef.instance.allowHtml = options?.allowHtml ?? false;

            componentRef.instance.confirmed
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (result: boolean) => {
                        result$.next(result);
                        result$.complete();
                        this.destroy(componentRef);
                    },
                    error: (error) => {
                        this.logger.logError('PlatformUiService.ask', error, { message, options });
                        result$.error(error);
                        this.destroy(componentRef);
                    }
                });

            this.appRef.attachView(componentRef.hostView);
            this.document.body.appendChild(componentRef.location.nativeElement);

            return result$.asObservable();
        } catch (error) {
            this.logger.logError('PlatformUiService.ask', error, { message, options });
            return throwError(() => error);
        }
    }

    success(message: string): void {
        this.showAlert(message, 'Success', 'success');
    }

    error(message: string): void {
        this.showAlert(message, 'Error', 'danger');
    }

    info(message: string): void {
        this.showAlert(message, 'Information', 'info');
    }

    warn(message: string): void {
        this.showAlert(message, 'Warning', 'warning');
    }

    show(message: string, options?: ToastOptions | number): void {
        if (!isPlatformBrowser(this.platformId)) {
            this.logger.logWarning('PlatformUiService.show', 'Toast not supported in SSR');
            return;
        }

        try {
            let duration = 3000;
            let allowHtml = false;

            if (typeof options === 'number') {
                duration = options;
            } else if (options) {
                duration = options.duration || 3000;
                allowHtml = options.allowHtml ?? false;
            }

            const componentRef = createComponent(ToastComponent, {
                environmentInjector: this.injector
            });

            componentRef.instance.message = message;
            componentRef.instance.allowHtml = allowHtml;

            this.appRef.attachView(componentRef.hostView);
            this.document.body.appendChild(componentRef.location.nativeElement);

            setTimeout(() => {
                this.destroy(componentRef);
            }, duration);
        } catch (error) {
            this.logger.logError('PlatformUiService.show', error, { message, options });
        }
    }

    private showAlert(message: string, title: string, type: 'info' | 'success' | 'warning' | 'danger'): void {
        if (!isPlatformBrowser(this.platformId)) {
            this.logger.logWarning('PlatformUiService.showAlert', 'Alert not supported in SSR');
            return;
        }

        try {
            const componentRef = createComponent(DialogComponent, {
                environmentInjector: this.injector
            });

            componentRef.instance.message = message;
            componentRef.instance.title = title;
            componentRef.instance.type = type;
            componentRef.instance.showCancel = false;

            componentRef.instance.confirmed
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.destroy(componentRef);
                    },
                    error: (error) => {
                        this.logger.logError('PlatformUiService.showAlert', error, { message, title, type });
                        this.destroy(componentRef);
                    }
                });

            this.appRef.attachView(componentRef.hostView);
            this.document.body.appendChild(componentRef.location.nativeElement);
        } catch (error) {
            this.logger.logError('PlatformUiService.showAlert', error, { message, title, type });
        }
    }

    private destroy<T>(componentRef: ComponentRef<T>): void {
        try {
            this.appRef.detachView(componentRef.hostView);
            componentRef.destroy();
        } catch (error) {
            this.logger.logError('PlatformUiService.destroy', error);
        }
    }
}
