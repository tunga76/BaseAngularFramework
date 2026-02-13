import { Signal, computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { User } from '../model/user.model';
import { UsersRepository } from '../data-access/users.repository';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, map } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

interface UsersState {
    users: User[];
    selectedUser: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: UsersState = {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
};

export const UsersStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((store) => ({
        activeUsersCount: computed(() => store.users().filter((u: User) => u.status === 'active').length),
        totalUsersCount: computed(() => store.users().length),
    })),
    withMethods((store, repository = inject(UsersRepository)) => ({
        loadAll: rxMethod<void>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap(() =>
                    repository.getUsers().pipe(
                        tapResponse({
                            next: (users: User[]) => patchState(store, { users, loading: false }),
                            error: (error: { message: string }) => patchState(store, { error: error.message, loading: false }),
                        })
                    )
                )
            )
        ),
        loadById: rxMethod<string>(
            pipe(
                tap(() => patchState(store, { loading: true, selectedUser: null })),
                switchMap((id) =>
                    repository.getUsers().pipe(
                        map((users: User[]) => users.find((u: User) => u.id === id) || null),
                        tapResponse({
                            next: (user: User | null) => patchState(store, { selectedUser: user, loading: false }),
                            error: (error: { message: string }) => patchState(store, { error: error.message, loading: false }),
                        })
                    )
                )
            )
        ),
        addUser: (user: User) => { patchState(store, { users: [...store.users(), user] }); },
        updateUser: (user: User) => { patchState(store, { users: store.users().map((u: User) => u.id === user.id ? user : u) }); },
        deleteUser: (id: string) => { patchState(store, { users: store.users().filter((u: User) => u.id !== id) }); }
    }))
);
