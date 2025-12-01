import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './presentation/components/navbar.component';
import { FooterComponent } from './presentation/components/footer.component';
import { CartComponent } from './presentation/components/cart.component';
import { CartRepository } from './application/state/cart.repository';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, CartComponent],
  template: `
    <div class="drawer drawer-end">
      <input id="cart-drawer" type="checkbox" class="drawer-toggle" [checked]="cartRepo.isOpen$ | async" (change)="toggleCart()" />
      
      <div class="drawer-content flex flex-col min-h-screen bg-cream pt-16">
        <app-navbar *ngIf="showLayout$ | async"></app-navbar>
        <main class="flex-grow">
          <router-outlet></router-outlet>
        </main>
        <app-footer *ngIf="showLayout$ | async"></app-footer>
      </div> 
      
      <div class="drawer-side z-50">
        <label for="cart-drawer" aria-label="close sidebar" class="drawer-overlay bg-black/60"></label>
        <app-cart></app-cart>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  title = 'sweet-shop';
  showLayout$: Observable<boolean>;

  constructor(
    public cartRepo: CartRepository,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.showLayout$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => !this.router.url.includes('/checkout')),
      startWith(true) // Default to true, will update on navigation
    );
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['openCart'] === 'true') {
        this.cartRepo.openCart();
      }
    });
  }

  toggleCart() {
    this.cartRepo.toggleCart();
  }

  closeCart() {
    this.cartRepo.closeCart();
  }
}
