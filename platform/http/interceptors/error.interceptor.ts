import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { PopupService } from '../../popup/services/popup.service';
import { PLATFORM_HTTP_OPTIONS } from '../models/http-options';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private popupService: PopupService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const options = req.context.get(PLATFORM_HTTP_OPTIONS);

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (options.showErrorPopup) {
                    const message = error.error?.message || error.statusText || 'An unexpected error occurred';
                    this.popupService.alert(message, `Error ${error.status}`);
                }
                return throwError(() => error);
            })
        );
    }
}
