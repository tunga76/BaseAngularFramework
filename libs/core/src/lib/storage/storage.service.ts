import { InjectionToken, inject } from '@angular/core';
import * as CryptoJS from 'crypto-js';

export abstract class StorageService {
    abstract getItem(key: string): string | null;
    abstract setItem(key: string, value: string): void;
    abstract removeItem(key: string): void;
    abstract clear(): void;
}

export const STORAGE_SERVICE = new InjectionToken<StorageService>('PLATFORM_STORAGE_SERVICE');
export const STORAGE_ENCRYPTION_KEY = new InjectionToken<string>('STORAGE_ENCRYPTION_KEY', {
    providedIn: 'root',
    factory: () => 'default-secret-key' // Should be overridden in app.config.ts
});

export class MemoryStorageService implements StorageService {
    private storage = new Map<string, string>();

    getItem(key: string): string | null {
        return this.storage.get(key) || null;
    }

    setItem(key: string, value: string): void {
        this.storage.set(key, value);
    }

    removeItem(key: string): void {
        this.storage.delete(key);
    }

    clear(): void {
        this.storage.clear();
    }
}

export class SessionStorageService implements StorageService {
    getItem(key: string): string | null {
        return sessionStorage.getItem(key);
    }

    setItem(key: string, value: string): void {
        sessionStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        sessionStorage.removeItem(key);
    }

    clear(): void {
        sessionStorage.clear();
    }
}

export class LocalStorageService implements StorageService {
    getItem(key: string): string | null {
        return localStorage.getItem(key);
    }

    setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}

export class EncryptedStorageService implements StorageService {
    constructor(
        private readonly storage: StorageService,
        private readonly secretKey: string
    ) { }

    getItem(key: string): string | null {
        const value = this.storage.getItem(key);
        if (!value) return null;
        try {
            const bytes = CryptoJS.AES.decrypt(value, this.secretKey);
            const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedValue || null;
        } catch (e) {
            console.error('Error decrypting storage value', e);
            return null;
        }
    }

    setItem(key: string, value: string): void {
        if (!value) return;
        const encrypted = CryptoJS.AES.encrypt(value, this.secretKey).toString();
        this.storage.setItem(key, encrypted);
    }

    removeItem(key: string): void {
        this.storage.removeItem(key);
    }

    clear(): void {
        this.storage.clear();
    }
}
