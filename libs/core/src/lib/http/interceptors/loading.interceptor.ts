import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../../loading/loading.service';
import { SKIP_LOADING, LOADING_KEY } from '../http-context.tokens';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

    // Check if loading should be skipped
    const skipLoading = req.context.get(SKIP_LOADING);
    if (skipLoading) {
        return next(req);
    }

    // Check if a specific loading key is provided (for local/component-specific loading)
    const loadingKey = req.context.get(LOADING_KEY);

    // Show loading
    loadingService.show(loadingKey ?? undefined);

    return next(req).pipe(
        finalize(() => {
            // Hide loading
            loadingService.hide(loadingKey ?? undefined);
        })
    );
};
