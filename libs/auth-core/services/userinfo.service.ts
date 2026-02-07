import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_CONFIG, AuthConfig } from '../config/auth-config';
import { UserClaims } from '../models/user-claims.model';

@Injectable({ providedIn: 'root' })
export class UserInfoService {
    constructor(
        @Inject(AUTH_CONFIG) private config: AuthConfig,
        private http: HttpClient
    ) { }

    loadUserInfo(): Observable<UserClaims> {
        return this.http.get<UserClaims>(`${this.config.authority}/userinfo`);
    }
}
