import { InjectionToken } from '@angular/core';
import { TokenResponse } from '../models/token.model';

export interface TokenStorage {
    saveToken(response: TokenResponse): void;
    getAccessToken(): string | null;
    getRefreshToken(): string | null;
    getIdToken(): string | null;
    clear(): void;
}

export const TOKEN_STORAGE = new InjectionToken<TokenStorage>('TOKEN_STORAGE');
