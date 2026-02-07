import { Injectable } from '@angular/core';
import { PkceUtils } from './pkce.util';

@Injectable({ providedIn: 'root' })
export class PkceService {
    private readonly STORAGE_KEY_PREFIX = 'pkce_';

    async generateChallengePair(): Promise<{ verifier: string; challenge: string }> {
        const verifier = PkceUtils.generateVerifier();
        const challenge = await PkceUtils.generateChallenge(verifier);
        return { verifier, challenge };
    }

    generateState(): string {
        return PkceUtils.generateState();
    }

    generateNonce(): string {
        return PkceUtils.generateNonce();
    }

    saveTransaction(state: string, verifier: string, nonce: string): void {
        sessionStorage.setItem(`${this.STORAGE_KEY_PREFIX}state`, state);
        sessionStorage.setItem(`${this.STORAGE_KEY_PREFIX}verifier`, verifier);
        sessionStorage.setItem(`${this.STORAGE_KEY_PREFIX}nonce`, nonce);
    }

    loadTransaction(): { state: string | null; verifier: string | null; nonce: string | null } {
        return {
            state: sessionStorage.getItem(`${this.STORAGE_KEY_PREFIX}state`),
            verifier: sessionStorage.getItem(`${this.STORAGE_KEY_PREFIX}verifier`),
            nonce: sessionStorage.getItem(`${this.STORAGE_KEY_PREFIX}nonce`)
        };
    }

    clearTransaction(): void {
        sessionStorage.removeItem(`${this.STORAGE_KEY_PREFIX}state`);
        sessionStorage.removeItem(`${this.STORAGE_KEY_PREFIX}verifier`);
        sessionStorage.removeItem(`${this.STORAGE_KEY_PREFIX}nonce`);
    }
}
