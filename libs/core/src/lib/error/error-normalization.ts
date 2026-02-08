export interface normalizedError {
    message: string;
    code?: string;
    status?: number;
    originalError?: any;
}

export function normalizeError(error: any): normalizedError {
    if (error && error.message) {
        return {
            message: error.message,
            code: error.code || 'UNKNOWN_ERROR',
            status: error.status,
            originalError: error
        };
    }
    return {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        originalError: error
    };
}
