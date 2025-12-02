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
    <div class="w-full mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8 min-h-screen relative">
      
      <!-- Mobile Filter/Sort Toolbar -->
      <div class="md:hidden flex items-center justify-between mb-4 border-b border-base-300 pb-4 sticky top-16 bg-base-100 z-30 -mx-4 px-4 pt-2">
        <button (click)="openFilterDrawer()" class="btn btn-ghost btn-sm flex items-center gap-2 text-base-content uppercase tracking-wide font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          Filtro
        </button>
        <div class="h-6 w-px bg-base-300"></div>
        <button (click)="openSortDrawer()" class="btn btn-ghost btn-sm flex items-center gap-2 text-base-content uppercase tracking-wide font-bold">
          Ordenar Por
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>

      <!-- Filters Sidebar (Desktop) -->
      <aside class="hidden md:block w-64 flex-shrink-0">
        <div class="sticky top-24">
          
          <!-- Categories Filter -->
          <div class="mb-8">
            <h3 class="font-bold text-lg mb-4 text-primary">Categoria</h3>
            <div class="flex flex-col gap-2">
              <label class="label cursor-pointer justify-start gap-3 p-0 hover:opacity-80 transition-opacity">
                <input type="checkbox" class="checkbox checkbox-sm checkbox-primary border-primary checked:bg-primary [--chkbg:theme(colors.primary)] [--chkfg:white]" 
                       [checked]="isCategorySelected('Bolos')" (change)="toggleCategory('Bolos')" />
                <span class="label-text text-base-content">Bolos</span>
                <span class="text-xs text-base-content/60 ml-auto">({{ getCategoryCount('Bolos') | async }})</span>
              </label>
              <label class="label cursor-pointer justify-start gap-3 p-0 hover:opacity-80 transition-opacity">
                <input type="checkbox" class="checkbox checkbox-sm checkbox-primary border-primary checked:bg-primary [--chkbg:theme(colors.primary)] [--chkfg:white]" 
                       [checked]="isCategorySelected('Doces')" (change)="toggleCategory('Doces')" />
                <span class="label-text text-base-content">Doces</span>
                <span class="text-xs text-base-content/60 ml-auto">({{ getCategoryCount('Doces') | async }})</span>
              </label>
              <label class="label cursor-pointer justify-start gap-3 p-0 hover:opacity-80 transition-opacity">
                <input type="checkbox" class="checkbox checkbox-sm checkbox-primary border-primary checked:bg-primary [--chkbg:theme(colors.primary)] [--chkfg:white]" 
                       [checked]="isCategorySelected('Especiais')" (change)="toggleCategory('Especiais')" />
                <span class="label-text text-base-content">Especiais</span>
                <span class="text-xs text-base-content/60 ml-auto">({{ getCategoryCount('Especiais') | async }})</span>
              </label>
            </div>
          </div>

          <!-- Promo Filter (Mock) -->
          <div class="mb-8">
            <h3 class="font-bold text-lg mb-4 text-primary">Promo</h3>
            <div class="flex flex-col gap-2">
              <label class="label cursor-pointer justify-start gap-3 p-0">
                <input type="checkbox" class="checkbox checkbox-sm checkbox-primary border-primary checked:bg-primary [--chkbg:theme(colors.primary)] [--chkfg:white]" 
                       [checked]="isPromoSelected('10% OFF')" (change)="togglePromo('10% OFF')" />
                <span class="label-text text-base-content">A partir de 10% OFF</span>
              </label>
              <label class="label cursor-pointer justify-start gap-3 p-0">
                <input type="checkbox" class="checkbox checkbox-sm checkbox-primary border-primary checked:bg-primary [--chkbg:theme(colors.primary)] [--chkfg:white]" 
                       [checked]="isPromoSelected('20% OFF')" (change)="togglePromo('20% OFF')" />
                <span class="label-text text-base-content">A partir de 20% OFF</span>
              </label>
            </div>
          </div>

        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1">
        
        <!-- Header & Sorting (Desktop) -->
        <div class="hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 class="text-2xl font-bold text-primary uppercase tracking-wide">Nossos Produtos</h2>
            <p class="text-sm text-base-content/60 mt-1">Delícias feitas com amor para você.</p>
          </div>
          
          <div class="flex items-center gap-2">
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-outline btn-sm border-base-300 hover:bg-base-200 hover:border-base-content/40 text-base-content font-normal normal-case gap-2 min-w-[160px] justify-between">
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
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          <div *ngFor="let product of displayedProducts$ | async">
            <app-product-card [product]="product" (addToCart)="addToCart($event)"></app-product-card>
          </div>
        </div>

        <!-- Loading / End of List -->
        <div class="py-12 text-center">
          <span *ngIf="isLoading" class="loading loading-spinner loading-md text-primary"></span>
          <p *ngIf="(displayedProducts$ | async)?.length === (filteredProducts$ | async)?.length && (filteredProducts$ | async)?.length !== 0" class="text-base-content/40 text-sm">
            Você chegou ao fim da lista.
          </p>
        </div>

      </div>
    </div>

    <!-- Mobile Filter Drawer -->
    <div class="fixed inset-0 z-50 md:hidden" *ngIf="isFilterOpen" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 transition-opacity" (click)="closeFilterDrawer()"></div>
      
      <!-- Drawer Panel -->
      <div class="absolute inset-x-0 bottom-0 h-[80vh] bg-base-100 rounded-t-2xl flex flex-col transition-transform transform translate-y-0">
        <div class="flex items-center justify-between p-4 border-b border-base-200">
          <h3 class="text-lg font-bold text-base-content">Filtrar Por</h3>
          <div class="flex items-center gap-2">
            <button *ngIf="((selectedCategories | async)?.size ?? 0) > 0 || ((selectedPromos | async)?.size ?? 0) > 0" (click)="clearFilters()" class="btn btn-ghost btn-sm text-primary normal-case font-normal">
              Limpar
            </button>
            <button (click)="closeFilterDrawer()" class="btn btn-ghost btn-sm btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4">
          <!-- Categories -->
          <div class="mb-6">
            <h4 class="font-bold text-base mb-3 text-base-content">Categoria</h4>
            <div class="flex flex-col gap-3">
              <label class="flex items-center gap-3">
                <input type="checkbox" class="checkbox checkbox-primary border-base-300 checked:bg-primary [--chkbg:theme(colors.primary)] [--chkfg:white]" 
                       [checked]="isCategorySelected('Bolos')" (change)="toggleCategory('Bolos')" />
                <span class="text-base text-base-content">Bolos</span>
                <span class="text-sm text-base-content/60 ml-auto">({{ getCategoryCount('Bolos') | async }})</span>
              </label>
              <label class="flex items-center gap-3">
                <input type="checkbox" class="checkbox checkbox-primary border-base-300 checked:bg-primary [--chkbg:theme(colors.primary)] [--chkfg:white]" 
                       [checked]="isCategorySelected('Doces')" (change)="toggleCategory('Doces')" />
                <span class="text-base text-base-content">Doces</span>
                <span class="text-sm text-base-content/60 ml-auto">({{ getCategoryCount('Doces') | async }})</span>
              </label>
              <label class="flex items-center gap-3">
                <input type="checkbox" class="checkbox checkbox-primary border-base-300 checked:bg-primary [--chkbg:theme(colors.primary)] [--chkfg:white]" 
                       [checked]="isCategorySelected('Especiais')" (change)="toggleCategory('Especiais')" />
                <span class="text-base text-base-content">Especiais</span>
                <span class="text-sm text-base-content/60 ml-auto">({{ getCategoryCount('Especiais') | async }})</span>
              </label>
            </div>
          </div>

          <!-- Promo (Mock) -->
          <div class="mb-6">
            <h4 class="font-bold text-base mb-3 text-base-content">Promo</h4>
            <div class="flex flex-col gap-3">
              <label class="flex items-center gap-3">
                <input type="checkbox" class="checkbox checkbox-primary border-base-300 checked:bg-primary [--chkbg:theme(colors.primary)] [--chkfg:white]" 
                       [checked]="isPromoSelected('10% OFF')" (change)="togglePromo('10% OFF')" />
                <span class="text-base text-base-content">A partir de 10% OFF</span>
              </label>
              <label class="flex items-center gap-3">
                <input type="checkbox" class="checkbox checkbox-primary border-base-300 checked:bg-primary [--chkbg:theme(colors.primary)] [--chkfg:white]" 
                       [checked]="isPromoSelected('20% OFF')" (change)="togglePromo('20% OFF')" />
                <span class="text-base text-base-content">A partir de 20% OFF</span>
              </label>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-base-200">
          <button (click)="closeFilterDrawer()" class="btn btn-primary w-full border-none hover:bg-primary-focus text-primary-content">
            Ver Resultados
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Sort Drawer -->
    <div class="fixed inset-0 z-50 md:hidden" *ngIf="isSortOpen" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 transition-opacity" (click)="closeSortDrawer()"></div>
      
      <!-- Drawer Panel -->
      <div class="absolute inset-x-0 bottom-0 bg-base-100 rounded-t-2xl flex flex-col transition-transform transform translate-y-0">
        <div class="flex items-center justify-between p-4 border-b border-base-200">
          <h3 class="text-lg font-bold text-base-content">Ordenar Por</h3>
          <button (click)="closeSortDrawer()" class="btn btn-ghost btn-sm btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div class="p-4 flex flex-col gap-2">
          <button (click)="setSort('price-asc'); closeSortDrawer()" class="flex items-center justify-between p-3 rounded-lg hover:bg-base-200" [class.bg-base-200]="currentSort === 'price-asc'">
            <span class="text-base" [class.font-bold]="currentSort === 'price-asc'" [class.text-primary]="currentSort === 'price-asc'">Menor Preço</span>
            <svg *ngIf="currentSort === 'price-asc'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
          </button>
          <button (click)="setSort('price-desc'); closeSortDrawer()" class="flex items-center justify-between p-3 rounded-lg hover:bg-base-200" [class.bg-base-200]="currentSort === 'price-desc'">
            <span class="text-base" [class.font-bold]="currentSort === 'price-desc'" [class.text-primary]="currentSort === 'price-desc'">Maior Preço</span>
            <svg *ngIf="currentSort === 'price-desc'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
          </button>
          <button (click)="setSort('name-asc'); closeSortDrawer()" class="flex items-center justify-between p-3 rounded-lg hover:bg-base-200" [class.bg-base-200]="currentSort === 'name-asc'">
            <span class="text-base" [class.font-bold]="currentSort === 'name-asc'" [class.text-primary]="currentSort === 'name-asc'">Nome (A-Z)</span>
            <svg *ngIf="currentSort === 'name-asc'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
          </button>
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
  selectedPromos = new BehaviorSubject<Set<string>>(new Set());
  currentSort = 'price-asc';

  // Mobile Drawer States
  isFilterOpen = false;
  isSortOpen = false;

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
      this.selectedCategories,
      this.selectedPromos
    ]).pipe(
      map(([products, categories, promos]) => {
        let filtered = products;

        // Filter by Category
        if (categories.size > 0) {
          filtered = filtered.filter(p => categories.has(p.category));
        }

        // Filter by Promo
        if (promos.size > 0) {
          filtered = filtered.filter(p => {
            const discount = this.calculateDiscount(p);
            if (promos.has('10% OFF') && discount >= 10) return true;
            if (promos.has('20% OFF') && discount >= 20) return true;
            return false;
          });
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Drawer Methods
  openFilterDrawer() {
    this.isFilterOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeFilterDrawer() {
    this.isFilterOpen = false;
    document.body.style.overflow = '';
  }

  clearFilters() {
    this.selectedCategories.next(new Set());
    this.selectedPromos.next(new Set());
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: null },
      queryParamsHandling: 'merge'
    });
  }

  openSortDrawer() {
    this.isSortOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeSortDrawer() {
    this.isSortOpen = false;
    document.body.style.overflow = '';
  }

  togglePromo(promo: string) {
    const current = new Set(this.selectedPromos.value);
    if (current.has(promo)) {
      current.delete(promo);
    } else {
      current.add(promo);
    }
    this.selectedPromos.next(current);
  }

  isPromoSelected(promo: string): boolean {
    return this.selectedPromos.value.has(promo);
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
