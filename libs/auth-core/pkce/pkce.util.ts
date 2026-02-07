export class PkceUtils {
    static generateVerifier(): string {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return this.base64UrlEncode(array);
    }

    static async generateChallenge(verifier: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const hash = await window.crypto.subtle.digest('SHA-256', data);
        return this.base64UrlEncode(new Uint8Array(hash));
    }

    private static base64UrlEncode(array: Uint8Array): string {
        let str = '';
        for (let i = 0; i < array.length; i++) {
            str += String.fromCharCode(array[i]);
        }
        return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    static generateState(): string {
        const array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        return this.base64UrlEncode(array);
    }

    static generateNonce(): string {
        const array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        return this.base64UrlEncode(array);
    }
}
