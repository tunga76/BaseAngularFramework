import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LOADING_ADAPTER } from '../core/tokens';
import { LoadingAdapter } from '../ui/adapters/loading.adapter';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    private activeRequests = 0;

    constructor(
        @Optional() @Inject(LOADING_ADAPTER) private adapter: LoadingAdapter
    ) { }

    get isLoading$(): Observable<boolean> {
        return this._isLoading$.asObservable();
    }

    show(): void {
        this.activeRequests++;
        if (this.activeRequests === 1) {
            this._isLoading$.next(true);
            this.adapter?.show();
        }
    }

    hide(): void {
        if (this.activeRequests > 0) {
            this.activeRequests--;
        }

        if (this.activeRequests === 0) {
            this._isLoading$.next(false);
            this.adapter?.hide();
        }
    }
}
