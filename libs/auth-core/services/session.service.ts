import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthSession } from '../models/auth-session.model';
import { UserClaims } from '../models/user-claims.model';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SessionService {
    private _session = new BehaviorSubject<AuthSession>({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
    });

    public readonly session$ = this._session.asObservable();
    public readonly isAuthenticated$ = this.session$.pipe(
        map(s => s.isAuthenticated),
        distinctUntilChanged()
    );
    public readonly user$ = this.session$.pipe(
        map(s => s.user),
        distinctUntilChanged()
    );

    setIsAuthenticated(isAuthenticated: boolean): void {
        this.update({ isAuthenticated });
    }

    setUser(user: UserClaims | null): void {
        this.update({ user });
    }

    setLoading(loading: boolean): void {
        this.update({ loading });
    }

    setError(error: string | null): void {
        this.update({ error });
    }

    private update(partial: Partial<AuthSession>): void {
        this._session.next({ ...this._session.value, ...partial });
    }

    get snapshot(): AuthSession {
        return this._session.value;
    }
}
