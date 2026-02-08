import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PopupService } from '../services/popup.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private popupService: PopupService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let message = 'An unknown error occurred.';
                if (error.error instanceof ErrorEvent) {
                    // Client-side error
                    message = error.error.message;
                } else {
                    // Server-side error
                    // Try to extract message from backend response if possible
                    if (typeof error.error === 'string') {
                        message = error.error;
                    } else if (error.error && error.error.message) {
                        message = error.error.message;
                    } else {
                        message = `Error Code: ${error.status}\nMessage: ${error.message}`;
                    }
                }

                // Avoid showing popup for 401 if handled by auth? Or maybe show it?
                // For now, show everything unless silent option is added later.
                this.popupService.showError(message);

                return throwError(() => error);
            })
        );
    }
}
