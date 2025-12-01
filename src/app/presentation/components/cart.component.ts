import { Component, Renderer2, Inject, OnDestroy } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { CartRepository } from '../../application/state/cart.repository';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  host: {
    'class': 'menu p-0 w-full md:w-[450px] h-full max-h-screen bg-base-100 text-base-content flex flex-col'
  },
  template: `
      <!-- Header -->
      <div class="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-base-100">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-soft-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 class="text-lg font-medium tracking-wide text-gray-500">CARRINHO</h2>
        </div>
        <button class="btn btn-ghost btn-sm btn-circle" (click)="closeCart()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Items -->
      <div class="flex-1 overflow-y-auto p-4 md:p-6">
        <div *ngIf="(items$ | async)?.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p>Seu carrinho está vazio.</p>
        </div>

        <div *ngFor="let item of items$ | async" class="flex gap-4 mb-6 pb-6 border-b border-gray-50 last:border-0">
          <!-- Product Image -->
          <div class="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
            <img [src]="item.product.image" [alt]="item.product.name" class="w-full h-full object-cover" />
          </div>

          <!-- Product Details -->
          <div class="flex-1 flex flex-col justify-between">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-soft-brown">{{ item.product.name }}</h3>
                <p class="text-xs text-gray-400 mt-1">{{ item.product.category }}</p>
              </div>
              <button class="text-gray-400 hover:text-error transition-colors" (click)="removeItem(item.product.id)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div class="flex justify-between items-end mt-4">
              <!-- Quantity Control -->
              <div class="flex items-center border border-gray-200 rounded-full h-8">
                <button class="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-l-full" (click)="updateQuantity(item.product.id, item.quantity - 1)">-</button>
                <span class="w-8 text-center text-sm font-medium">{{ item.quantity }}</span>
                <button class="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-r-full" (click)="updateQuantity(item.product.id, item.quantity + 1)">+</button>
              </div>

              <!-- Price -->
              <div class="text-right">
                <p class="text-sm font-bold text-soft-brown">R$ {{ (item.product.price * item.quantity).toFixed(2) }}</p>
                <p class="text-xs text-sage" *ngIf="item.quantity > 1">R$ {{ item.product.price.toFixed(2) }} un</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 md:p-6 border-t border-gray-100 bg-base-100">
        <!-- Delivery Estimate (Static for UI match) -->
        <div class="flex justify-between items-center py-3 border-b border-gray-50 mb-4 cursor-pointer group">
          <span class="text-sm font-bold text-soft-brown">PRAZO DE ENTREGA</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-soft-brown transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>

        <!-- Subtotal -->
        <div class="flex justify-between items-center mb-6">
          <span class="font-bold text-soft-brown">SUBTOTAL</span>
          <div class="text-right">
            <span class="text-xl font-bold text-soft-brown">R$ {{ (total$ | async)?.toFixed(2) }}</span>
            <p class="text-xs text-sage">no pix</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-3">
          <button class="btn btn-primary btn-block h-12 bg-soft-brown hover:bg-sage border-none text-white font-bold tracking-wide rounded-md" (click)="checkout()" [disabled]="(items$ | async)?.length === 0">
            FINALIZAR A COMPRA
          </button>
          <button class="btn btn-ghost btn-block btn-sm text-xs font-bold text-gray-500 underline decoration-gray-300 hover:decoration-soft-brown" (click)="closeCart()">
            CONTINUAR COMPRANDO
          </button>
        </div>
      </div>
  `
})
export class CartComponent implements OnDestroy {
  isOpen$;
  items$;
  total$;
  private destroy$ = new Subject<void>();

  constructor(
    private cartRepo: CartRepository,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isOpen$ = this.cartRepo.isOpen$;
    this.items$ = this.cartRepo.items$;
    this.total$ = this.cartRepo.total$;

    this.isOpen$.pipe(takeUntil(this.destroy$)).subscribe(isOpen => {
      if (isOpen) {
        this.renderer.addClass(this.document.body, 'overflow-hidden');
      } else {
        this.renderer.removeClass(this.document.body, 'overflow-hidden');
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.renderer.removeClass(this.document.body, 'overflow-hidden');
  }

  toggleCart() {
    this.cartRepo.toggleCart();
  }

  closeCart() {
    this.cartRepo.closeCart();
  }

  updateQuantity(id: string, quantity: number) {
    this.cartRepo.updateQuantity(id, quantity);
  }

  removeItem(id: string) {
    this.cartRepo.removeItem(id);
  }

  checkout() {
    this.cartRepo.closeCart();
    this.router.navigate(['/checkout']);
  }
}
