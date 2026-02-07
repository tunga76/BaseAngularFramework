import { Injectable } from '@angular/core';
import { TokenStorage } from './token-storage.interface';
import { TokenResponse } from '../models/token.model';

@Injectable()
export class SessionTokenStorage implements TokenStorage {
    private readonly KEY = 'auth_tokens';

    saveToken(response: TokenResponse): void {
        sessionStorage.setItem(this.KEY, JSON.stringify(response));
    }

    getAccessToken(): string | null {
        const data = this.getData();
        return data ? data.access_token : null;
    }

    getRefreshToken(): string | null {
        const data = this.getData();
        return data ? data.refresh_token || null : null;
    }

    getIdToken(): string | null {
        const data = this.getData();
        return data ? data.id_token || null : null;
    }

    clear(): void {
        sessionStorage.removeItem(this.KEY);
    }

    private getData(): TokenResponse | null {
        const item = sessionStorage.getItem(this.KEY);
        if (!item) return null;
        try {
            return JSON.parse(item);
        } catch {
            return null;
        }
    }
}
