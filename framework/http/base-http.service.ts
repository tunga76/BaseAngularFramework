import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_PLATFORM_CONFIG } from '../core/tokens';
import { AppPlatformConfig } from '../config/framework-config';
import { RequestOptions } from '../models/request-options';
import { REQUEST_OPTIONS } from '../core/context-tokens';

export interface UrlOptions {
    controller: string;
    action?: string;
}

@Injectable()
export abstract class BaseHttpService {
    protected baseUrl: string;

    constructor(
        protected http: HttpClient,
        @Inject(APP_PLATFORM_CONFIG) protected config: AppPlatformConfig
    ) {
        this.baseUrl = this.normalizeUrl(config.api.baseUrl);
    }

    protected get<T>(urlOrOptions: string | UrlOptions, options?: RequestOptions): Observable<T> {
        const url = this.buildUrl(urlOrOptions);
        const { endpoint, httpParams, context } = this.processRequest(url, options);
        return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params: httpParams, context });
    }

    protected post<T>(urlOrOptions: string | UrlOptions, body: any, options?: RequestOptions): Observable<T> {
        const url = this.buildUrl(urlOrOptions);
        const { endpoint, httpParams, context } = this.processRequest(url, options);
        return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, { params: httpParams, context });
    }

    protected put<T>(urlOrOptions: string | UrlOptions, body: any, options?: RequestOptions): Observable<T> {
        const url = this.buildUrl(urlOrOptions);
        const { endpoint, httpParams, context } = this.processRequest(url, options);
        return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, { params: httpParams, context });
    }

    protected delete<T>(urlOrOptions: string | UrlOptions, options?: RequestOptions): Observable<T> {
        const url = this.buildUrl(urlOrOptions);
        const { endpoint, httpParams, context } = this.processRequest(url, options);
        return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, { params: httpParams, context });
    }

    private normalizeUrl(url: string): string {
        return url.endsWith('/') ? url.slice(0, -1) : url;
    }

    private buildUrl(urlOrOptions: string | UrlOptions): string {
        if (typeof urlOrOptions === 'string') {
            return urlOrOptions.startsWith('/') ? urlOrOptions.slice(1) : urlOrOptions;
        }
        return urlOrOptions.action
            ? `${urlOrOptions.controller}/${urlOrOptions.action}`
            : urlOrOptions.controller;
    }

    private processRequest(url: string, options?: RequestOptions): { endpoint: string; httpParams: HttpParams; context: HttpContext } {
        let endpoint = url;
        const params = options?.params || {};
        let queryParams: any = {};

        // Convert HttpParams to object if needed for replacement logic
        if (params instanceof HttpParams) {
            params.keys().forEach(key => {
                queryParams[key] = params.get(key);
            });
        } else {
            queryParams = { ...params };
        }

        // URL param replacement :key
        if (endpoint.includes(':')) {
            endpoint = endpoint.replace(/:([a-zA-Z0-9_]+)/g, (match, key) => {
                if (queryParams.hasOwnProperty(key)) {
                    const value = queryParams[key];
                    delete queryParams[key];
                    return encodeURIComponent(String(value));
                }
                return match;
            });
        }

        const httpParams = this.createParams(queryParams);
        const context = options?.context || new HttpContext();

        if (options) {
            context.set(REQUEST_OPTIONS, options);
        }

        return {
            endpoint,
            httpParams,
            context
        };
    }

    private createParams(params: any): HttpParams {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    httpParams = httpParams.set(key, params[key]);
                }
            });
        }
        return httpParams;
    }
}
