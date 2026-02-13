import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    private readonly config = {
        apiUrl: 'https://api.egm.gov.tr/hks/v1',
        apiVersion: 'v1',
        environment: 'production',
        timeout: 30000
    };

    get<K extends keyof typeof this.config>(key: K): typeof this.config[K] {
        return this.config[key];
    }

    get all() {
        return { ...this.config };
    }
}
