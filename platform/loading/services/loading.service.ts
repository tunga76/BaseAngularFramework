import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { LoadingState } from '../models/loading-state';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private state = new BehaviorSubject<LoadingState>({ isLoading: false, count: 0 });

    isLoading$ = this.state.pipe(map(s => s.isLoading));

    show(): void {
        const current = this.state.value;
        this.state.next({
            isLoading: true,
            count: current.count + 1
        });
    }

    hide(): void {
        const current = this.state.value;
        const newCount = Math.max(0, current.count - 1);
        this.state.next({
            isLoading: newCount > 0,
            count: newCount
        });
    }
}
