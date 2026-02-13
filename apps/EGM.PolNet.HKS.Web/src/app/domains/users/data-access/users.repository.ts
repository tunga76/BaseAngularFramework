import { Injectable, inject } from '@angular/core';
import { UsersApi } from './users.api';
import { User } from '../model/user.model';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsersRepository {
    private api = inject(UsersApi);

    getUsers(): Observable<User[]> {
        return this.api.getAllUsers();
    }

    getActiveUsers(): Observable<User[]> {
        return this.api.getAllUsers().pipe(
            map(users => users.filter(u => u.status === 'active'))
        );
    }
}
