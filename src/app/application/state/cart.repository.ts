import { createStore, select, withProps } from '@ngneat/elf';
import { persistState, localStorageStrategy } from '@ngneat/elf-persist-state';
import { Injectable } from '@angular/core';
import { CartItem } from '../../domain/models/cart.model';
import { Product } from '../../domain/models/product.model';
import { map } from 'rxjs/operators';

interface CartProps {
    items: CartItem[];
    isOpen: boolean;
}

const store = createStore(
    { name: 'cart' },
    withProps<CartProps>({ items: [], isOpen: false })
);

export const persist = persistState(store, {
    key: 'cart',
    storage: localStorageStrategy,
});

@Injectable({ providedIn: 'root' })
export class CartRepository {
    cart$ = store.pipe(select((state) => state));
    items$ = store.pipe(select((state) => state.items));
    isOpen$ = store.pipe(select((state) => state.isOpen));

    total$ = this.items$.pipe(
        map((items) => items.reduce((acc, item) => acc + item.product.price * item.quantity, 0))
    );

    count$ = this.items$.pipe(
        map((items) => items.reduce((acc, item) => acc + item.quantity, 0))
    );

    addItem(product: Product) {
        store.update((state) => {
            const existing = state.items.find((i) => i.product.id === product.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((i) =>
                        i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                };
            }
            return {
                ...state,
                items: [...state.items, { product, quantity: 1 }],
            };
        });
        this.openCart();
    }

    removeItem(productId: string) {
        store.update((state) => ({
            ...state,
            items: state.items.filter((i) => i.product.id !== productId),
        }));
    }

    updateQuantity(productId: string, quantity: number) {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }
        store.update((state) => ({
            ...state,
            items: state.items.map((i) =>
                i.product.id === productId ? { ...i, quantity } : i
            ),
        }));
    }

    toggleCart() {
        store.update((state) => ({ ...state, isOpen: !state.isOpen }));
    }

    openCart() {
        store.update((state) => ({ ...state, isOpen: true }));
    }

    closeCart() {
        store.update((state) => ({ ...state, isOpen: false }));
    }
}
