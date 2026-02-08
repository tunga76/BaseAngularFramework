import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CORE_CONFIG } from '../config/core-config';

@Injectable({ providedIn: 'root' })
export class ApiClient {
    private http = inject(HttpClient);
    private config = inject(CORE_CONFIG);

    get<T>(url: string, options?: {
        params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext
    }): Observable<T> {
        return this.http.get<T>(this.buildUrl(url), options);
    }

    post<T>(url: string, body: any | null, options?: {
        params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext
    }): Observable<T> {
        return this.http.post<T>(this.buildUrl(url), body, options);
    }

    put<T>(url: string, body: any | null, options?: {
        params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext
    }): Observable<T> {
        return this.http.put<T>(this.buildUrl(url), body, options);
    }

    delete<T>(url: string, options?: {
        params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext
    }): Observable<T> {
        return this.http.delete<T>(this.buildUrl(url), options);
    }

    patch<T>(url: string, body: any | null, options?: {
        params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
        headers?: HttpHeaders | { [header: string]: string | string[] };
        context?: HttpContext
    }): Observable<T> {
        return this.http.patch<T>(this.buildUrl(url), body, options);
    }

    private buildUrl(url: string): string {
        if (url.startsWith('http')) return url;
        return `${this.config.apiUrl}/${url.startsWith('/') ? url.substring(1) : url}`;
    }
}
