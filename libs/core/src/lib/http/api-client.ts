import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CORE_CONFIG } from '../config/core-config';

export interface UrlBuilderOptions {
    controller: string;
    action?: string;
}

export type UrlOrOptions = string | UrlBuilderOptions;

export interface ApiRequestOptions {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | { [param: string]: any };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ApiClient {
    private http = inject(HttpClient);
    private config = inject(CORE_CONFIG);

    get<T>(urlOrOptions: UrlOrOptions, options?: ApiRequestOptions): Observable<T> {
        const { url, params } = this.prepareRequest(urlOrOptions, options?.params);
        return this.http.get<T>(url, { ...options, params });
    }

    post<T>(urlOrOptions: UrlOrOptions, body: any | null, options?: ApiRequestOptions): Observable<T> {
        const { url, params } = this.prepareRequest(urlOrOptions, options?.params);
        return this.http.post<T>(url, body, { ...options, params });
    }

    put<T>(urlOrOptions: UrlOrOptions, body: any | null, options?: ApiRequestOptions): Observable<T> {
        const { url, params } = this.prepareRequest(urlOrOptions, options?.params);
        return this.http.put<T>(url, body, { ...options, params });
    }

    delete<T>(urlOrOptions: UrlOrOptions, options?: ApiRequestOptions): Observable<T> {
        const { url, params } = this.prepareRequest(urlOrOptions, options?.params);
        return this.http.delete<T>(url, { ...options, params });
    }

    patch<T>(urlOrOptions: UrlOrOptions, body: any | null, options?: ApiRequestOptions): Observable<T> {
        const { url, params } = this.prepareRequest(urlOrOptions, options?.params);
        return this.http.patch<T>(url, body, { ...options, params });
    }

    private prepareRequest(urlOrOptions: UrlOrOptions, incomingParams?: HttpParams | { [param: string]: any }): { url: string, params: HttpParams } {
        let endpoint = this.resolveUrl(urlOrOptions);

        // Normalize params to a plain object for processing
        let queryParams: Record<string, any> = {};
        if (incomingParams instanceof HttpParams) {
            incomingParams.keys().forEach(key => {
                queryParams[key] = incomingParams.get(key);
            });
        } else if (incomingParams) {
            queryParams = { ...incomingParams };
        }

        // URL param replacement :key
        if (endpoint.includes(':')) {
            endpoint = endpoint.replace(/:([a-zA-Z0-9_]+)/g, (match, key) => {
                if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
                    const value = queryParams[key];
                    delete queryParams[key]; // Remove from query params since it's used in path
                    return encodeURIComponent(String(value));
                }
                return match;
            });
        }

        // Build final URL
        const finalUrl = endpoint.startsWith('http')
            ? endpoint
            : `${this.config.apiUrl}/${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`;

        // Convert remaining params back to HttpParams
        let httpParams = new HttpParams();
        Object.keys(queryParams).forEach(key => {
            if (queryParams[key] !== undefined && queryParams[key] !== null) {
                httpParams = httpParams.set(key, queryParams[key]);
            }
        });

        return { url: finalUrl, params: httpParams };
    }

    private resolveUrl(urlOrOptions: UrlOrOptions): string {
        if (typeof urlOrOptions === 'string') {
            return urlOrOptions;
        }
        return urlOrOptions.action
            ? `${urlOrOptions.controller}/${urlOrOptions.action}`
            : urlOrOptions.controller;
    }
}
