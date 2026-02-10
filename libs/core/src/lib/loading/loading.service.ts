import { Injectable, computed, signal, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

const DEFAULT_SPINNER_KEY = 'primary';

@Injectable({ providedIn: 'root' })
export class LoadingService {
    private spinner = inject(NgxSpinnerService);

    // Global loading count (aggregates all spinners for a simple global "is busy" check)
    private loadingCount = signal(0);

    // Detailed map for keyed loading states (e.g., 'user-list', 'save-button')
    private loadingMap = signal<Map<string, number>>(new Map());

    // Global loading state
    readonly isLoading = computed(() => this.loadingCount() > 0);

    /**
     * Checks if a specific key is currently loading.
     * If no key is provided, checks the default spinner.
     */
    isLoadingKey(key: string = DEFAULT_SPINNER_KEY): boolean {
        return (this.loadingMap().get(key) || 0) > 0;
    }

    show(key: string = DEFAULT_SPINNER_KEY): void {
        // Update global signal (for backward compatibility / general UI binding)
        this.loadingCount.update(c => c + 1);

        this.loadingMap.update(map => {
            const newMap = new Map(map);
            const current = newMap.get(key) || 0;
            newMap.set(key, current + 1);

            // If this is the first request for this key, show the spinner via NgxSpinner
            if (current === 0) {
                this.spinner.show(key);
            }
            return newMap;
        });
    }

    hide(key: string = DEFAULT_SPINNER_KEY): void {
        this.loadingCount.update(c => Math.max(0, c - 1));

        this.loadingMap.update(map => {
            const newMap = new Map(map);
            const current = newMap.get(key) || 0;

            if (current > 0) {
                const newValue = current - 1;
                newMap.set(key, newValue);

                // If count drops to 0, hide the spinner via NgxSpinner
                if (newValue === 0) {
                    this.spinner.hide(key);
                    newMap.delete(key); // Cleanup
                }
            }
            return newMap;
        });
    }
}
