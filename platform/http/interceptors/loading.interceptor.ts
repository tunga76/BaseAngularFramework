import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../../loading/services/loading.service';
import { PLATFORM_HTTP_OPTIONS } from '../models/http-options';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(private loadingService: LoadingService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const options = req.context.get(PLATFORM_HTTP_OPTIONS);

        if (options.showLoading) {
            this.loadingService.show();
            return next.handle(req).pipe(
                finalize(() => this.loadingService.hide())
            );
        }

        return next.handle(req);
    }
}
