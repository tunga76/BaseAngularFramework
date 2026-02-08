import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface ResilienceOptions {
    retry?: number;
    timeoutMs?: number;
    circuitBreaker?: boolean;
}

export interface RequestOptions {
    params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
    headers?: HttpHeaders | { [header: string]: string | string[] };
    context?: HttpContext;
    disableLoading?: boolean;
    resilience?: ResilienceOptions;
}
