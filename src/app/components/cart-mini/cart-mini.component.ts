import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-cart-mini',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './cart-mini.component.html',
    styleUrl: './cart-mini.component.css'
})
export class CartMiniComponent {
    @Output() close = new EventEmitter<void>();
    cartItems$: Observable<any[]>;
    cartTotal$: Observable<number>;

    constructor(private cartService: CartService) {
        this.cartItems$ = this.cartService.cartItems$;
        this.cartTotal$ = this.cartItems$.pipe(
            map(items => items.reduce((acc, item) => acc + (item.product.preco * item.quantidade), 0))
        );
    }

    updateQuantity(productId: string, quantity: number) {
        if (quantity <= 0) {
            this.cartService.removeFromCart(productId);
        } else {
            this.cartService.updateQuantity(productId, quantity);
        }
    }
}
