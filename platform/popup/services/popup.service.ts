import { Injectable, Type } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PopupOptions, ModalInstance } from '../models/popup-options';

@Injectable({
    providedIn: 'root'
})
export class PopupService {
    private modalsSubject = new BehaviorSubject<ModalInstance[]>([]);
    modals$ = this.modalsSubject.asObservable();

    alert(message: string, title: string = 'Alert'): Observable<void> {
        const result = new Subject<void>();
        const id = Math.random().toString(36).substring(7);

        // Lazy circular import workaround if needed, 
        // but we'll use a dynamic component approach in modal-host
        this.addModal({
            id,
            component: null as any, // Will be handled by type in host
            options: { message, title, confirmText: 'OK', type: 'alert' } as any,
            resolve: () => {
                result.next();
                result.complete();
                this.close(id);
            }
        });

        return result.asObservable();
    }

    confirm(message: string, title: string = 'Confirm'): Observable<boolean> {
        const result = new Subject<boolean>();
        const id = Math.random().toString(36).substring(7);

        this.addModal({
            id,
            component: null as any,
            options: { message, title, confirmText: 'Yes', cancelText: 'No', type: 'confirm' } as any,
            resolve: (res: boolean) => {
                result.next(res);
                result.complete();
                this.close(id);
            }
        });

        return result.asObservable();
    }

    open<T>(component: Type<T>, options: PopupOptions): Observable<any> {
        const result = new Subject<any>();
        const id = Math.random().toString(36).substring(7);

        this.addModal({
            id,
            component,
            options,
            resolve: (res: any) => {
                result.next(res);
                result.complete();
                this.close(id);
            }
        });

        return result.asObservable();
    }

    private addModal(modal: ModalInstance): void {
        this.modalsSubject.next([...this.modalsSubject.value, modal]);
    }

    close(id: string): void {
        this.modalsSubject.next(this.modalsSubject.value.filter(m => m.id !== id));
    }
}
