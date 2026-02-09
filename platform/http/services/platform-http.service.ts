import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlatformHttpOptions, PLATFORM_HTTP_OPTIONS } from '../models/http-options';

@Injectable({
    providedIn: 'root'
})
export class PlatformHttpService {
    constructor(private http: HttpClient) { }

    get<T>(url: string, options?: PlatformHttpOptions): Observable<T> {
        return this.http.get<T>(url, { context: this.createContext(options) });
    }

    post<T>(url: string, body: any, options?: PlatformHttpOptions): Observable<T> {
        return this.http.post<T>(url, body, { context: this.createContext(options) });
    }

    put<T>(url: string, body: any, options?: PlatformHttpOptions): Observable<T> {
        return this.http.put<T>(url, body, { context: this.createContext(options) });
    }

    delete<T>(url: string, options?: PlatformHttpOptions): Observable<T> {
        return this.http.delete<T>(url, { context: this.createContext(options) });
    }

    private createContext(options?: PlatformHttpOptions): HttpContext {
        const context = new HttpContext();
        if (options) {
            context.set(PLATFORM_HTTP_OPTIONS, {
                showLoading: options.showLoading ?? true,
                showErrorPopup: options.showErrorPopup ?? true,
                timeout: options.timeout
            });
        }
        return context;
    }
}
