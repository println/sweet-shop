import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../components/product-card.component';
import { ProductsRepository } from '../../application/state/products.repository';
import { CartRepository } from '../../application/state/cart.repository';
import { Product } from '../../domain/models/product.model';
import { Observable, map, BehaviorSubject, combineLatest } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { AppSettings } from '../../config/app.config';
import { ROUTES } from '../../config/routes.config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="hero min-h-[60vh] w-full relative mb-12">      
      <div class="hero-content text-center text-neutral-content relative z-10">
        <div class="max-w-md">
          <h1 class="mb-5 text-3xl md:text-5xl font-bold bg-accent text-accent-content inline-block p-3">{{ appSettings.layout.hero.title }}</h1>
          <p class="mb-5 text-lg">{{ appSettings.layout.hero.subtitle }}</p>
          <button [routerLink]="routes.products.path" class="btn btn-primary btn-lg text-primary-content border-none hover:bg-primary-focus">Ver Produtos</button>
        </div>
      </div>
      <img [src]="appSettings.layout.hero.image" alt="Hero Background" class="absolute inset-0 w-full h-full object-cover" />              
      <div class="absolute inset-0 bg-black/25 z-0"></div>
    </div>

    <!-- Tabs Section -->
    <section class="mx-[2em] p-4 mb-8">
      <div class="flex justify-center">
        <button *ngFor="let category of categories" 
                (click)="selectedCategory = category"
                class="px-4 md:px-8 pt-3 md:pt-4 text-sm md:text-lg uppercase tracking-widest transition-all duration-50 
                border-b border-b-[1px] text-base-content pb-[4px] cursor-pointer"
                [class.font-bold]="selectedCategory === category"
                [class.pb-[4px]]="selectedCategory != category"
                [class.pb-[1px]]="selectedCategory === category"
                [class.border-b-[4px]]="selectedCategory === category"
                [class.border-primary]="selectedCategory === category"
                [class.text-primary]="selectedCategory === category"
                >
          <span class="inline-block pb-3">{{ category }}</span>
        </button>
      </div>
    </section>

    <!-- Highlights Carousel (Full Width) -->
    <section class="relative group/carousel w-full mb-8 overflow-x-hidden">
      <!-- Products List -->
      <div class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pl-4 pr-4 md:pl-10 md:pr-10 scroll-px-4 md:scroll-px-10 pb-3" #carousel>
        <div *ngFor="let product of (filteredProducts$ | async)" [@fade] class="min-w-[90%] sm:min-w-[50%] lg:min-w-[25%] p-2 snap-center">
          <app-product-card [product]="product" (addToCart)="addToCart($event)"></app-product-card>
        </div>
      </div>
      
      <!-- Navigation Buttons -->
      <button (click)="scrollLeft(carousel)" class="absolute left-4 top-1/2 -translate-y-1/2 bg-base-100/80 hover:bg-base-100 p-3 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button (click)="scrollRight(carousel)" class="absolute right-4 top-1/2 -translate-y-1/2 bg-base-100/80 hover:bg-base-100 p-3 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </section>

    <!-- Button Section -->
    <section class="container mx-auto p-4 mb-12 text-center">
      <button [routerLink]="routes.products.path" [queryParams]="{category: selectedCategory}" class="btn btn-wide btn-primary hover:bg-primary-focus border-none uppercase tracking-widest text-primary-content">
        SHOP {{ selectedCategory }}
      </button>
    </section>
  `
})
export class HomeComponent implements OnInit {
  @ViewChild('carousel') carousel!: ElementRef<HTMLElement>;
  appSettings = AppSettings;
  routes = ROUTES;
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
