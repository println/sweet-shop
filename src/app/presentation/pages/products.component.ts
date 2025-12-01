import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsRepository } from '../../application/state/products.repository';
import { CartRepository } from '../../application/state/cart.repository';
import { Product } from '../../domain/models/product.model';
import { Observable, combineLatest, map, BehaviorSubject, take } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { ProductCardComponent } from '../components/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent],
  template: `
    <div class="container mx-auto p-4 flex flex-col md:flex-row gap-8 min-h-screen">
      <!-- Filters Sidebar -->
      <aside class="w-full md:w-64 flex-shrink-0">
        <div class="sticky top-24">
          
          <!-- Categories Filter -->
          <div class="mb-8">
            <h3 class="font-bold text-lg mb-4 text-soft-brown">Categoria</h3>
            <div class="flex flex-col gap-2">
              <label class="label cursor-pointer justify-start gap-3 p-0 hover:opacity-80 transition-opacity">
                <input type="checkbox" class="checkbox checkbox-sm checkbox-primary border-soft-brown checked:bg-soft-brown [--chkbg:theme(colors.soft-brown)] [--chkfg:white]" 
                       [checked]="isCategorySelected('Bolos')" (change)="toggleCategory('Bolos')" />
                <span class="label-text text-gray-600">Bolos</span>
                <span class="text-xs text-gray-400 ml-auto">({{ getCategoryCount('Bolos') | async }})</span>
              </label>
              <label class="label cursor-pointer justify-start gap-3 p-0 hover:opacity-80 transition-opacity">
                <input type="checkbox" class="checkbox checkbox-sm checkbox-primary border-soft-brown checked:bg-soft-brown [--chkbg:theme(colors.soft-brown)] [--chkfg:white]" 
                       [checked]="isCategorySelected('Doces')" (change)="toggleCategory('Doces')" />
                <span class="label-text text-gray-600">Doces</span>
                <span class="text-xs text-gray-400 ml-auto">({{ getCategoryCount('Doces') | async }})</span>
              </label>
              <label class="label cursor-pointer justify-start gap-3 p-0 hover:opacity-80 transition-opacity">
                <input type="checkbox" class="checkbox checkbox-sm checkbox-primary border-soft-brown checked:bg-soft-brown [--chkbg:theme(colors.soft-brown)] [--chkfg:white]" 
                       [checked]="isCategorySelected('Especiais')" (change)="toggleCategory('Especiais')" />
                <span class="label-text text-gray-600">Especiais</span>
                <span class="text-xs text-gray-400 ml-auto">({{ getCategoryCount('Especiais') | async }})</span>
              </label>
            </div>
          </div>

          <!-- Promo Filter (Mock) -->
          <div class="mb-8">
            <h3 class="font-bold text-lg mb-4 text-soft-brown">Promo</h3>
            <div class="flex flex-col gap-2">
              <label class="label cursor-pointer justify-start gap-3 p-0">
                <input type="checkbox" class="checkbox checkbox-sm checkbox-primary border-soft-brown checked:bg-soft-brown [--chkbg:theme(colors.soft-brown)] [--chkfg:white]" />
                <span class="label-text text-gray-600">A partir de 10% OFF</span>
              </label>
              <label class="label cursor-pointer justify-start gap-3 p-0">
                <input type="checkbox" class="checkbox checkbox-sm checkbox-primary border-soft-brown checked:bg-soft-brown [--chkbg:theme(colors.soft-brown)] [--chkfg:white]" />
                <span class="label-text text-gray-600">A partir de 20% OFF</span>
              </label>
            </div>
          </div>

        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1">
        
        <!-- Header & Sorting -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 class="text-2xl font-bold text-soft-brown uppercase tracking-wide">Nossos Produtos</h2>
            <p class="text-sm text-gray-500 mt-1">Delícias feitas com amor para você.</p>
          </div>
          
          <div class="flex items-center gap-2">
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-outline btn-sm border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 font-normal normal-case gap-2 min-w-[160px] justify-between">
                {{ getSortLabel() }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </label>
              <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-1">
                <li><a (click)="setSort('price-asc')" [class.active]="currentSort === 'price-asc'">Menor Preço</a></li>
                <li><a (click)="setSort('price-desc')" [class.active]="currentSort === 'price-desc'">Maior Preço</a></li>
                <li><a (click)="setSort('name-asc')" [class.active]="currentSort === 'name-asc'">Nome (A-Z)</a></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          <div *ngFor="let product of displayedProducts$ | async">
            <app-product-card [product]="product" (addToCart)="addToCart($event)"></app-product-card>
          </div>
        </div>

        <!-- Loading / End of List -->
        <div class="py-12 text-center">
          <span *ngIf="isLoading" class="loading loading-spinner loading-md text-soft-brown"></span>
          <p *ngIf="(displayedProducts$ | async)?.length === (filteredProducts$ | async)?.length && (filteredProducts$ | async)?.length !== 0" class="text-gray-400 text-sm">
            Você chegou ao fim da lista.
          </p>
        </div>

      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  displayedProducts$ = new BehaviorSubject<Product[]>([]);

  selectedCategories = new BehaviorSubject<Set<string>>(new Set());
  currentSort = 'price-asc';

  // Infinite Scroll State
  pageSize = 9;
  currentPage = 1;
  isLoading = false;

  constructor(
    private productsRepo: ProductsRepository,
    private cartRepo: CartRepository,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.products$ = this.productsRepo.products$.pipe(
      map(products => this.enrichProducts(products))
    );

    this.filteredProducts$ = combineLatest([
      this.products$,
      this.selectedCategories
    ]).pipe(
      map(([products, categories]) => {
        let filtered = products;

        // Filter by Category
        if (categories.size > 0) {
          filtered = filtered.filter(p => categories.has(p.category));
        }

        // Sort
        return this.sortProducts(filtered, this.currentSort);
      })
    );
  }

  ngOnInit() {
    this.productsRepo.load();

    // Handle Query Params for Category
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      const newCategories = new Set<string>();

      if (category) {
        if (Array.isArray(category)) {
          category.forEach(c => newCategories.add(c));
        } else {
          newCategories.add(category);
        }
      }

      this.selectedCategories.next(newCategories);
    });

    // Initial load of displayed products
    this.filteredProducts$.subscribe(products => {
      this.currentPage = 1;
      this.updateDisplayedProducts(products);
    });
  }

  // Mock Data Enrichment
  enrichProducts(products: Product[]): Product[] {
    return products.map(p => ({
      ...p,
      originalPrice: p.originalPrice || p.price * 1.2, // Mock original price
      rating: p.rating || 4 + Math.random(), // Mock rating 4.0 - 5.0
      reviews: p.reviews || Math.floor(Math.random() * 500) + 10, // Mock reviews
      isNew: Math.random() > 0.8 // Mock 'New' badge
    }));
  }

  sortProducts(products: Product[], sort: string): Product[] {
    const sorted = [...products];
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }

  setSort(sort: string) {
    this.currentSort = sort;
    // Trigger re-emission
    this.selectedCategories.next(this.selectedCategories.value);
  }

  getSortLabel(): string {
    switch (this.currentSort) {
      case 'price-asc': return 'Menor Preço';
      case 'price-desc': return 'Maior Preço';
      case 'name-asc': return 'Nome (A-Z)';
      default: return 'Ordenar por';
    }
  }

  toggleCategory(category: string) {
    const current = new Set(this.selectedCategories.value);
    if (current.has(category)) {
      current.delete(category);
    } else {
      current.add(category);
    }

    const categories = Array.from(current);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: categories.length > 0 ? categories : null },
      queryParamsHandling: 'merge'
    });
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.value.has(category);
  }

  getCategoryCount(category: string): Observable<number> {
    return this.products$.pipe(
      map(products => products.filter(p => p.category === category).length)
    );
  }

  addToCart(product: Product) {
    this.cartRepo.addItem(product);
  }

  calculateDiscount(product: Product): number {
    if (!product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  // Infinite Scroll Logic
  @HostListener('window:scroll', [])
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
      this.loadMore();
    }
  }

  loadMore() {
    if (this.isLoading) return;

    this.filteredProducts$.pipe(take(1)).subscribe(allProducts => {
      const currentLength = this.displayedProducts$.value.length;
      if (currentLength < allProducts.length) {
        this.isLoading = true;
        // Simulate network delay for effect
        setTimeout(() => {
          this.currentPage++;
          this.updateDisplayedProducts(allProducts);
          this.isLoading = false;
        }, 500);
      }
    });
  }

  updateDisplayedProducts(allProducts: Product[]) {
    const endIndex = this.currentPage * this.pageSize;
    this.displayedProducts$.next(allProducts.slice(0, endIndex));
  }
}
