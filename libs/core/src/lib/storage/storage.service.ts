import { InjectionToken } from '@angular/core';

export abstract class StorageService {
    abstract getItem(key: string): string | null;
    abstract setItem(key: string, value: string): void;
    abstract removeItem(key: string): void;
    abstract clear(): void;
}

export const STORAGE_SERVICE = new InjectionToken<StorageService>('PLATFORM_STORAGE_SERVICE');

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
