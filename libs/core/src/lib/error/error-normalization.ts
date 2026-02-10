import { HttpErrorResponse } from '@angular/common/http';

export interface NormalizedError {
    message: string;
    code: string;
    status?: number;
    originalError: any;
}

export function normalizeError(error: any): NormalizedError {
    let errorMessage = 'An unknown error occurred.';
    let errorCode = 'UNKNOWN';
    let status = undefined;

    // 1. Client-side or Network Error
    if (error instanceof ErrorEvent) {
        errorMessage = `Client Error: ${error.message}`;
        errorCode = 'CLIENT_ERROR';
    }
    // 2. HTTP Error Response
    else if (error instanceof HttpErrorResponse) {
        status = error.status;

        if (error.error instanceof ErrorEvent) {
            // Client-side error wrapped in HttpErrorResponse
            errorMessage = `Client Error: ${error.error.message}`;
            errorCode = 'CLIENT_ERROR';
        } else {
            // Server-side Error
            // Try to extract a meaningful message from the backend response
            if (typeof error.error === 'string') {
                errorMessage = error.error;
            } else if (error.error && typeof error.error === 'object') {
                // Check for common backend error structures (message, error, code)
                errorMessage = error.error.message || error.error.error || error.message;
                errorCode = error.error.code || errorCode;
            } else {
                errorMessage = error.message;
            }

            // Handle specific Status Codes
            switch (error.status) {
                case 400:
                    errorCode = 'BAD_REQUEST';
                    break;
                case 401:
                    errorCode = 'UNAUTHORIZED';
                    errorMessage = 'Your session has expired. Please log in again.';
                    break;
                case 403:
                    errorCode = 'FORBIDDEN';
                    errorMessage = `You do not have permission to perform this action.`;
                    break;
                case 404:
                    errorCode = 'NOT_FOUND';
                    break;
                case 500:
                    errorCode = 'SERVER_ERROR';
                    errorMessage = 'Internal Server Error. Please try again later.';
                    break;
            }
        }
    }
    // 3. Regular Error object or anything else
    else if (error instanceof Error) {
        errorMessage = error.message;
        errorCode = error.name;
    }

    return {
        message: errorMessage,
        code: errorCode,
        status: status,
        originalError: error
    };
}
