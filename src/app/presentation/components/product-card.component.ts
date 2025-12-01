import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../domain/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="group/card flex flex-col h-full">
      <!-- Image -->
      <div class="relative aspect-square overflow-hidden bg-gray-100 mb-3 cursor-pointer rounded-[4px]" [routerLink]="['/products', product.id]">
        <img [src]="product.image" (error)="handleImageError($event)" [alt]="product.name" class="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-700 ease-out" />
        
        <!-- Badges -->
        <div class="absolute top-2 right-2 flex flex-col gap-1 items-end">
          <span *ngIf="product.isNew" class="badge badge-sm bg-white text-black border-none font-bold shadow-sm">NEW</span>
          <span *ngIf="product.originalPrice && product.originalPrice > product.price" class="badge badge-sm bg-soft-brown text-white border-none font-bold shadow-sm">
            {{ calculateDiscount(product) }}% OFF
          </span>
        </div>

        <!-- Quick Add Button (Visible on Hover) -->
        <button (click)="$event.stopPropagation(); onAddToCart()" class="absolute bottom-0 left-0 w-full bg-black/80 text-white py-3 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300 font-medium text-sm flex items-center justify-center gap-2 hover:bg-black">
          ADICIONAR AO CARRINHO
        </button>
      </div>

      <!-- Info -->
      <div class="flex flex-col gap-1 flex-1">
        <!-- Rating -->
        <div class="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <div class="flex text-yellow-500">
            <span *ngFor="let star of [1,2,3,4,5]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" [class.fill-current]="star <= (product.rating || 5)" [class.text-gray-300]="star > (product.rating || 5)" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            </span>
          </div>
          <span>{{ product.reviews || 0 }} reviews</span>
        </div>

        <h3 class="font-medium text-gray-900 text-base leading-tight group-hover:underline decoration-1 underline-offset-2 cursor-pointer" [routerLink]="['/products', product.id]">{{ product.name }}</h3>
        
        <div class="flex items-center gap-2 mt-1">
          <span *ngIf="product.originalPrice" class="text-sm text-gray-400 line-through">R$ {{ product.originalPrice.toFixed(2) }}</span>
          <span class="text-base font-bold text-soft-brown">R$ {{ product.price.toFixed(2) }}</span>
          <span class="text-xs text-gray-500 font-normal">no pix</span>
        </div>
        
        <div class="flex gap-2 mt-2">
          <!-- Color circles mock -->
          <div class="w-4 h-4 rounded-full bg-[#5D4037] border border-gray-300 cursor-pointer hover:scale-110 transition-transform" title="Chocolate"></div>
          <div class="w-4 h-4 rounded-full bg-[#F5F5DC] border border-gray-300 cursor-pointer hover:scale-110 transition-transform" title="Baunilha"></div>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  calculateDiscount(product: Product): number {
    if (!product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  onAddToCart() {
    this.addToCart.emit(this.product);
  }

  handleImageError(event: any) {
    event.target.src = 'https://placehold.co/500x625/e2e8f0/475569?text=No+Image';
  }
}

