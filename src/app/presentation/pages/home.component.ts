import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../components/product-card.component';
import { ProductsRepository } from '../../application/state/products.repository';
import { CartRepository } from '../../application/state/cart.repository';
import { Product } from '../../domain/models/product.model';
import { Observable, map, BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="hero min-h-[60vh] w-full relative mb-12">
      <div class="hero-overlay bg-opacity-60 bg-black"></div>
      <div class="hero-content text-center text-neutral-content relative z-10">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold text-cream">Sweet Shop</h1>
          <p class="mb-5 text-lg">Delícias artesanais feitas com amor para você.</p>
          <button routerLink="/products" class="btn btn-primary btn-lg text-white border-none bg-soft-brown hover:bg-sage">Ver Produtos</button>
        </div>
      </div>
      <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Hero Background" class="absolute inset-0 w-full h-full object-cover -z-10" />
    </div>

    <!-- Tabs Section -->
    <section class="mx-[2em] p-4 mb-8">
      <div class="flex justify-center border-b border-gray-200">
        <button *ngFor="let category of categories" 
                (click)="selectedCategory = category"
                class="px-8 py-4 text-lg font-bold uppercase tracking-widest border-b-2 transition-colors duration-300"
                [class.border-black]="selectedCategory === category"
                [class.text-black]="selectedCategory === category"
                [class.border-transparent]="selectedCategory !== category"
                [class.text-gray-400]="selectedCategory !== category"
                [class.hover:text-gray-600]="selectedCategory !== category">
          {{ category }}
        </button>
      </div>
    </section>

    <!-- Highlights Carousel (Full Width) -->
    <section class="relative group/carousel w-full mb-8 overflow-x-hidden">
      <!-- Products List -->
      <div class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pl-10 pr-10 scroll-px-10 pb-3" #carousel>
        <div *ngFor="let product of (filteredProducts$ | async)" class="min-w-[85%] sm:min-w-[50%] lg:min-w-[25%] p-2 snap-start">
          <app-product-card [product]="product" (addToCart)="addToCart($event)"></app-product-card>
        </div>
      </div>
      
      <!-- Navigation Buttons -->
      <button (click)="scrollLeft(carousel)" class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button (click)="scrollRight(carousel)" class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </section>

    <!-- Button Section -->
    <section class="container mx-auto p-4 mb-12 text-center">
      <button routerLink="/products" [queryParams]="{category: selectedCategory}" class="btn btn-wide bg-black text-white hover:bg-gray-800 border-none uppercase tracking-widest">
        SHOP {{ selectedCategory }}
      </button>
    </section>
  `
})
export class HomeComponent implements OnInit {
  @ViewChild('carousel') carousel!: ElementRef<HTMLElement>;
  categories = ['Bolos', 'Doces', 'Especiais'];
  _selectedCategory = 'Bolos';

  selectedCategorySubject = new BehaviorSubject<string>('Bolos');
  filteredProducts$: Observable<Product[]>;

  constructor(
    private productsRepo: ProductsRepository,
    private cartRepo: CartRepository
  ) {
    this.filteredProducts$ = combineLatest([
      this.productsRepo.products$,
      this.selectedCategorySubject
    ]).pipe(
      map(([products, category]) => {
        // Enrich products first (mock data)
        const enriched = products.map(p => ({
          ...p,
          originalPrice: p.originalPrice || p.price * 1.2,
          rating: p.rating || 4.5,
          reviews: p.reviews || 50,
          isNew: Math.random() > 0.7
        }));

        return enriched.filter(p => p.category === category);
      })
    );
  }

  ngOnInit() {
    this.productsRepo.load();
  }

  get selectedCategory() {
    return this._selectedCategory;
  }

  set selectedCategory(value: string) {
    this._selectedCategory = value;
    this.selectedCategorySubject.next(value);
    if (this.carousel && this.carousel.nativeElement) {
      this.carousel.nativeElement.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  addToCart(product: Product) {
    this.cartRepo.addItem(product);
  }

  scrollLeft(element: HTMLElement) {
    const item = element.firstElementChild as HTMLElement;
    if (item) {
      element.scrollBy({ left: -item.clientWidth, behavior: 'smooth' });
    }
  }

  scrollRight(element: HTMLElement) {
    const item = element.firstElementChild as HTMLElement;
    if (item) {
      element.scrollBy({ left: item.clientWidth, behavior: 'smooth' });
    }
  }


}
