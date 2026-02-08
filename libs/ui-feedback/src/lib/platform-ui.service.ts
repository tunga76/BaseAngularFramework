import { Injectable, ApplicationRef, createComponent, EnvironmentInjector, ComponentRef, inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { DialogComponent } from './components/dialog.component';
import { ToastComponent } from './components/toast.component';
import { ConfirmOptions, ConfirmService, AlertService, ToastService } from './ui-interfaces';

@Injectable({
    providedIn: 'root'
})
export class PlatformUiService implements ConfirmService, AlertService, ToastService {
    private appRef = inject(ApplicationRef);
    private injector = inject(EnvironmentInjector);

    ask(message: string, options?: ConfirmOptions): Observable<boolean> {
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

        componentRef.instance.confirmed.subscribe((result: boolean) => {
            result$.next(result);
            result$.complete();
            this.destroy(componentRef);
        });

        this.appRef.attachView(componentRef.hostView);
        document.body.appendChild(componentRef.location.nativeElement);

        return result$.asObservable();
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

    show(message: string, duration: number = 3000): void {
        const componentRef = createComponent(ToastComponent, {
            environmentInjector: this.injector
        });

        componentRef.instance.message = message;

        this.appRef.attachView(componentRef.hostView);
        document.body.appendChild(componentRef.location.nativeElement);

        setTimeout(() => {
            this.destroy(componentRef);
        }, duration);
    }

    private showAlert(message: string, title: string, type: any): void {
        const componentRef = createComponent(DialogComponent, {
            environmentInjector: this.injector
        });

        componentRef.instance.message = message;
        componentRef.instance.title = title;
        componentRef.instance.type = type;
        componentRef.instance.showCancel = false;

        componentRef.instance.confirmed.subscribe(() => {
            this.destroy(componentRef);
        });

        this.appRef.attachView(componentRef.hostView);
        document.body.appendChild(componentRef.location.nativeElement);
    }

    private destroy(componentRef: ComponentRef<any>): void {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
    }
}
