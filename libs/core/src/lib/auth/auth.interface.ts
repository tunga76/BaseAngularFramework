import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface IAuthService {
    getAccessToken(): Observable<string | null>;
    refresh(): Observable<string>;
    logout(): void;
}

export const AUTH_SERVICE = new InjectionToken<IAuthService>('AUTH_SERVICE');
