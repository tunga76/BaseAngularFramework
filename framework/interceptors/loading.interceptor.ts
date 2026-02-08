import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { REQUEST_OPTIONS } from '../core/context-tokens';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    constructor(private loadingService: LoadingService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const options = request.context.get(REQUEST_OPTIONS);

        if (options?.disableLoading) {
            return next.handle(request);
        }

        this.loadingService.show();

        return next.handle(request).pipe(
            finalize(() => {
                this.loadingService.hide();
            })
        );
    }
}
