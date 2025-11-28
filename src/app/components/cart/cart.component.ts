import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from '../../models';

import { DialogService } from '../../services/dialog.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems$: Observable<CartItem[]>;
  total$: Observable<number>;

  constructor(
    private cartService: CartService,
    private dialogService: DialogService,
    private toastService: ToastService
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.total$ = this.cartItems$.pipe(
      map(items => items.reduce((acc, item) => acc + (item.product.preco * item.quantidade), 0))
    );
  }

  updateQuantity(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string) {
    this.dialogService.confirm({
      title: 'Remover item',
      message: 'Tem certeza que deseja remover este item do carrinho?',
      confirmText: 'Remover',
      cancelText: 'Cancelar'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.cartService.removeFromCart(productId);
        this.toastService.show('Item removido do carrinho', 'info');
      }
    });
  }

  handleImageError(event: any) {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzU1NTU1NSI+U2VtIEltYWdlbTwvdGV4dD48L3N2Zz4=';
  }
}
