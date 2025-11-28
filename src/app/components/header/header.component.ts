import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationStart } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CartMiniComponent } from '../cart-mini/cart-mini.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, CartMiniComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  cartCount$: Observable<number>;
  cartItems$: Observable<any[]>;
  cartTotal$: Observable<number>;
  showPopup = false;
  private timeoutId: any;

  constructor(
    private cartService: CartService,
    private elementRef: ElementRef,
    private router: Router
  ) {
    this.cartCount$ = this.cartService.cartItems$.pipe(
      map(items => items.reduce((acc, item) => acc + item.quantidade, 0))
    );
    this.cartItems$ = this.cartService.cartItems$;
    this.cartTotal$ = this.cartItems$.pipe(
      map(items => items.reduce((acc, item) => acc + (item.product.preco * item.quantidade), 0))
    );

    this.cartService.showPopup$.subscribe(() => {
      this.showPopup = true;
      this.resetHideTimeout();
    });

    // Close popup on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.showPopup = false;
    });
  }

  onCartHover() {
    this.showPopup = true;
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  onCartLeave() {
    this.resetHideTimeout();
  }

  private resetHideTimeout() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showPopup = false;
      if (this.timeoutId) clearTimeout(this.timeoutId);
    }
  }
}
