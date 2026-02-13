import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../../../infrastructure/api/base-api.service';
import { User } from '../model/user.model';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../../core/config/app-config.service';

@Injectable({
    providedIn: 'root'
})
export class UsersApi extends BaseApiService {
    private config = inject(AppConfigService);
    protected override readonly baseUrl = this.config.get('apiUrl');

    getAllUsers(): Observable<User[]> {
        return this.get<User[]>('users');
    }

    getUserById(id: string): Observable<User> {
        return this.get<User>(`users/${id}`);
    }

    updateUser(id: string, user: Partial<User>): Observable<User> {
        return this.put<User>(`users/${id}`, user);
    }
}
