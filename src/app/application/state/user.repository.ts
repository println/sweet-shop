import { createStore, select, withProps } from '@ngneat/elf';
import { persistState, localStorageStrategy } from '@ngneat/elf-persist-state';
import { Injectable } from '@angular/core';
import { User } from '../../domain/models/user.model';

interface UserProps {
    user: User | null;
}

const store = createStore(
    { name: 'user' },
    withProps<UserProps>({ user: null })
);

export const persist = persistState(store, {
    key: 'user',
    storage: localStorageStrategy,
});

@Injectable({ providedIn: 'root' })
export class UserRepository {
    user$ = store.pipe(select((state) => state.user));

    updateUser(user: User) {
        store.update((state) => ({ ...state, user }));
    }

    exportState(): string {
        return JSON.stringify(store.getValue());
    }

    importState(json: string) {
        try {
            const state = JSON.parse(json);
            store.update(() => state);
        } catch (e) {
            console.error('Invalid state JSON', e);
        }
    }
}
