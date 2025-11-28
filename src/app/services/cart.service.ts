import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem, Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  private showPopupSubject = new Subject<boolean>();
  showPopup$ = this.showPopupSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cartItemsSubject.next(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart', e);
      }
    }
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  addToCart(product: Product, quantidade: number = 1) {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantidade += quantidade;
      this.saveCart([...currentItems]);
    } else {
      this.saveCart([...currentItems, { product, quantidade }]);
    }
    this.showPopupSubject.next(true);
  }

  removeFromCart(productId: string) {
    const currentItems = this.cartItemsSubject.value;
    this.saveCart(currentItems.filter(item => item.product.id !== productId));
  }

  updateQuantity(productId: string, quantidade: number) {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(i => i.product.id === productId);
    if (item) {
      item.quantidade = quantidade;
      if (item.quantidade <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart([...currentItems]);
      }
    }
  }

  clearCart() {
    this.saveCart([]);
  }

  getTotal(): number {
    return this.cartItemsSubject.value.reduce((acc, item) => acc + (item.product.preco * item.quantidade), 0);
  }

  // For state export/import
  getCartState(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  setCartState(items: CartItem[]) {
    this.saveCart(items);
  }
}
