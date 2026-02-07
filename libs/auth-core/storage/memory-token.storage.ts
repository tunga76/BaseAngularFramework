import { Injectable } from '@angular/core';
import { TokenStorage } from './token-storage.interface';
import { TokenResponse } from '../models/token.model';

@Injectable({ providedIn: 'root' })
export class MemoryTokenStorage implements TokenStorage {
    private _accessToken: string | null = null;
    private _idToken: string | null = null;
    private _refreshToken: string | null = null;

    saveToken(response: TokenResponse): void {
        this._accessToken = response.access_token;
        if (response.id_token) this._idToken = response.id_token;
        // Even if cookie-based, if the response contains it (e.g. for mobile), we store it.
        if (response.refresh_token) this._refreshToken = response.refresh_token;
    }

    getAccessToken(): string | null {
        return this._accessToken;
    }

    getRefreshToken(): string | null {
        return this._refreshToken;
    }

    getIdToken(): string | null {
        return this._idToken;
    }

    clear(): void {
        this._accessToken = null;
        this._idToken = null;
        this._refreshToken = null;
    }
}
