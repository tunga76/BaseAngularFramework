import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../../loading/loading.service';
import { SKIP_LOADING } from '../http-context.tokens';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);
    const skipLoading = req.context.get(SKIP_LOADING);

    if (skipLoading) {
        return next(req);
    }

    loadingService.show();
    return next(req).pipe(
        finalize(() => loadingService.hide())
    );
};
