import { HttpInterceptorFn } from '@angular/common/http';
import { CUSTOM_HEADERS, CUSTOM_BODY_DATA } from '../http-context.tokens';

/**
 * Factory function that creates an interceptor to add static custom headers AND dynamic headers from HttpContext.
 * Usage: provideHttpClient(withInterceptors([createCustomHeadersInterceptor({'X-App-Version': '1.0.0'})]))
 * Dynamic Usage: http.get('/api', { context: new HttpContext().set(CUSTOM_HEADERS, { 'X-Page-Id': '123' }) })
 */
export const createCustomHeadersInterceptor = (staticHeaders: Record<string, string> = {}): HttpInterceptorFn => {
    return (req, next) => {
        const contextHeaders = req.context.get(CUSTOM_HEADERS) || {};
        const combinedHeaders = { ...staticHeaders, ...contextHeaders };

        // If no headers to add, skip cloning
        if (Object.keys(combinedHeaders).length === 0) {
            return next(req);
        }

        const clonedReq = req.clone({
            setHeaders: combinedHeaders
        });
        return next(clonedReq);
    };
};

/**
 * Factory function that creates an interceptor to merge static AND dynamic data into the request body.
 * Usage: provideHttpClient(withInterceptors([createCustomBodyInterceptor({ appVersion: '1.0.0' })]))
 * Dynamic Usage: http.post('/api', data, { context: new HttpContext().set(CUSTOM_BODY_DATA, { trackingId: 'xyz' }) })
 */
export const createCustomBodyInterceptor = (staticBodyData: Record<string, any> = {}): HttpInterceptorFn => {
    return (req, next) => {
        const contextBodyData = req.context.get(CUSTOM_BODY_DATA) || {};
        const combinedBodyData = { ...staticBodyData, ...contextBodyData };

        // If no data to add, skip logic
        if (Object.keys(combinedBodyData).length === 0) {
            return next(req);
        }

        // Only modify body for methods that typically have a body (POST, PUT, PATCH)
        // and when the body is a plain object (not FormData, ArrayBuffer, etc.)
        if (['POST', 'PUT', 'PATCH'].includes(req.method) &&
            req.body &&
            typeof req.body === 'object' &&
            !Array.isArray(req.body) &&
            !(req.body instanceof FormData)) {

            const clonedReq = req.clone({
                body: { ...(req.body as object), ...combinedBodyData }
            });
            return next(clonedReq);
        }
        return next(req);
    };
};
