import { InjectionToken, Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

export abstract class StorageService {
    abstract getItem(key: string): string | null;
    abstract setItem(key: string, value: string): void;
    abstract removeItem(key: string): void;
    abstract clear(): void;

    /**
     * Helper to get and parse a JSON object
     */
    getObject<T>(key: string): T | null {
        const item = this.getItem(key);
        if (!item) return null;
        try {
            return JSON.parse(item) as T;
        } catch (e) {
            console.warn(`[Storage] Error parsing key '${key}':`, e);
            return null;
        }
    }

    /**
     * Helper to stringify and set a JSON object
     */
    setObject<T>(key: string, value: T): void {
        try {
            this.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`[Storage] Error invoking setItem for '${key}':`, e);
        }
    }
}

export const STORAGE_SERVICE = new InjectionToken<StorageService>('PLATFORM_STORAGE_SERVICE');
export const STORAGE_ENCRYPTION_KEY = new InjectionToken<string>('STORAGE_ENCRYPTION_KEY', {
    providedIn: 'root',
    factory: () => 'default-secret-key' // Should be overridden in app.config.ts
});

@Injectable()
export class MemoryStorageService extends StorageService {
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

@Injectable()
export class SessionStorageService extends StorageService {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        super();
    }

    getItem(key: string): string | null {
        if (!isPlatformBrowser(this.platformId)) return null;
        return sessionStorage.getItem(key);
    }

    setItem(key: string, value: string): void {
        if (!isPlatformBrowser(this.platformId)) return;
        sessionStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        if (!isPlatformBrowser(this.platformId)) return;
        sessionStorage.removeItem(key);
    }

    clear(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        sessionStorage.clear();
    }
}

@Injectable()
export class LocalStorageService extends StorageService {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        super();
    }

    getItem(key: string): string | null {
        if (!isPlatformBrowser(this.platformId)) return null;
        return localStorage.getItem(key);
    }

    setItem(key: string, value: string): void {
        if (!isPlatformBrowser(this.platformId)) return;
        localStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        if (!isPlatformBrowser(this.platformId)) return;
        localStorage.removeItem(key);
    }

    clear(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        localStorage.clear();
    }
}

@Injectable()
export class EncryptedStorageService extends StorageService {
    constructor(
        private readonly storage: StorageService,
        @Inject(STORAGE_ENCRYPTION_KEY) private readonly secretKey: string
    ) {
        super();
    }

    getItem(key: string): string | null {
        const value = this.storage.getItem(key);
        if (!value) return null;
        try {
            const bytes = AES.decrypt(value, this.secretKey);
            const decryptedValue = bytes.toString(encUtf8);
            return decryptedValue || null;
        } catch (e) {
            console.error('Error decrypting storage value', e);
            return null;
        }
    }

    // Support generic getObject overriding base if needed? 
    // No, base getObject calls this.getItem, so it works automatically on decrypted string!

    setItem(key: string, value: string): void {
        if (value === undefined || value === null) return;
        // Allow empty string? Yes.
        try {
            const encrypted = AES.encrypt(value, this.secretKey).toString();
            this.storage.setItem(key, encrypted);
        } catch (e) {
            console.error('Error encrypting storage value', e);
        }
    }

    removeItem(key: string): void {
        this.storage.removeItem(key);
    }

    clear(): void {
        this.storage.clear();
    }
}
