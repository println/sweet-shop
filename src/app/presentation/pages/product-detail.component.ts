import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsRepository } from '../../application/state/products.repository';
import { CartRepository } from '../../application/state/cart.repository';
import { Product } from '../../domain/models/product.model';
import { Observable, map, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-4 lg:p-8 min-h-screen bg-white pb-24 lg:pb-8">
      
      <!-- Back Link -->
      <div class="mb-6">
        <a routerLink="/products" class="text-sm text-gray-500 hover:text-soft-brown flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          Voltar para produtos
        </a>
      </div>

      <div *ngIf="product$ | async as product; else loading" class="flex flex-col lg:flex-row gap-6 lg:gap-12">
        
        <!-- Mobile Header (Title, Badges, Reviews) -->
        <div class="lg:hidden">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
          
          <div class="flex items-center gap-4 mb-4">
            <div class="flex items-center gap-1">
              <span class="badge badge-outline border-gray-300 text-xs font-bold px-2 py-1">BLACK FRIDAY</span>
              <span class="badge badge-outline border-gray-300 text-xs font-bold px-2 py-1" *ngIf="product.originalPrice">{{ calculateDiscount(product) }}% OFF</span>
            </div>
            <div class="flex items-center gap-1 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-900 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span class="font-bold text-gray-900">{{ (product.rating || 4.9).toFixed(1) }}</span>
              <span class="underline decoration-gray-300 underline-offset-2">({{ product.reviews || 25308 }} reviews)</span>
            </div>
          </div>
        </div>

        <!-- Left Column: Images -->
        <div class="w-full lg:w-3/5">
          
          <!-- Mobile Carousel -->
          <div class="lg:hidden relative aspect-[4/5] bg-gray-100 overflow-hidden mb-6 group -mx-4 w-[calc(100%+2rem)]">
            <img [src]="images[currentImageIndex]" [alt]="product.name" class="w-full h-full object-cover transition-opacity duration-300">
            
            <!-- Navigation Arrows -->
            <button (click)="prevImage()" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white" *ngIf="images.length > 1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button (click)="nextImage()" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white" *ngIf="images.length > 1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>

            <!-- Dots -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <span *ngFor="let img of images; let i = index" 
                    class="block w-2 h-2 rounded-full transition-colors"
                    [class.bg-soft-brown]="i === currentImageIndex"
                    [class.bg-white]="i !== currentImageIndex">
              </span>
            </div>
          </div>

          <!-- Desktop Grid -->
          <div class="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden" *ngFor="let img of images">
              <img [src]="img" [alt]="product.name" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
            </div>
          </div>
        </div>

        <!-- Right Column: Product Details -->
        <div class="w-full lg:w-2/5 flex flex-col gap-6 sticky top-24 h-fit">
          
          <div>
            <!-- Desktop Title, Badges, Reviews (Hidden on Mobile) -->
            <div class="hidden lg:block">
              <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
              
              <!-- Ratings & Badges -->
              <div class="flex items-center gap-4 mb-4">
                <div class="flex items-center gap-1">
                  <span class="badge badge-outline border-gray-300 text-xs font-bold px-2 py-1">BLACK FRIDAY</span>
                  <span class="badge badge-outline border-gray-300 text-xs font-bold px-2 py-1" *ngIf="product.originalPrice">{{ calculateDiscount(product) }}% OFF</span>
                </div>
                <div class="flex items-center gap-1 text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-900 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span class="font-bold text-gray-900">{{ (product.rating || 4.9).toFixed(1) }}</span>
                  <span class="underline decoration-gray-300 underline-offset-2">({{ product.reviews || 25308 }} reviews)</span>
                </div>
              </div>
            </div>

            <!-- Price -->
            <div class="flex flex-col mb-6">
              <div class="flex items-center gap-3">
                <span *ngIf="product.originalPrice" class="text-lg text-gray-400 line-through">R$ {{ product.originalPrice.toFixed(2) }}</span>
                <span class="text-2xl md:text-3xl font-bold text-soft-brown">R$ {{ product.price.toFixed(2) }}</span>
                <span class="text-sm text-gray-500">no pix</span>
              </div>
              <p class="text-xs text-red-700 font-medium mt-1">com cupom <span class="underline">BF2025</span></p>
            </div>

            <!-- Description -->
            <div class="prose prose-sm text-gray-600 mb-6">
              <p>{{ product.description }}</p>
              <p class="mt-4">
                Nossos doces são feitos artesanalmente com os melhores ingredientes. 
                Sabor inigualável, textura perfeita e aquele toque de carinho que faz toda a diferença.
                Ideal para presentear ou para aquele momento de indulgência.
              </p>
            </div>

            <!-- Flavors (Sabor) -->
            <div class="mb-6">
              <h3 class="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Sabor: <span class="font-normal text-gray-600">{{ selectedFlavor }}</span></h3>
              <div class="flex flex-wrap gap-3">
                <button *ngFor="let flavor of flavors" 
                        (click)="selectedFlavor = flavor.name"
                        class="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 relative"
                        [class.border-soft-brown]="selectedFlavor === flavor.name"
                        [class.border-gray-200]="selectedFlavor !== flavor.name"
                        [style.background-color]="flavor.color"
                        [title]="flavor.name">
                  <span *ngIf="flavor.isNew" class="absolute -top-3 -right-3 badge badge-xs bg-white text-black border-gray-200 shadow-sm text-[0.6rem] px-1">NEW</span>
                </button>
              </div>
            </div>

            <!-- Size (Tamanho) -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide">Tamanho</h3>
                <button class="text-xs text-gray-500 underline flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                  Guia de medidas
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <button *ngFor="let size of sizes" 
                        (click)="selectedSize = size"
                        class="btn btn-sm min-w-[3rem] border-gray-200 bg-white hover:bg-gray-50 hover:border-soft-brown text-gray-700 font-normal"
                        [class.btn-active]="selectedSize === size"
                        [class.bg-gray-100]="selectedSize === size"
                        [class.border-soft-brown]="selectedSize === size"
                        [class.text-soft-brown]="selectedSize === size">
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Quantity (Quantidade) -->
            <div class="mb-8">
              <h3 class="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Quantidade</h3>
              <div class="grid grid-cols-3 gap-3">
                <div (click)="selectedQuantity = 1"
                     class="border rounded-lg p-3 cursor-pointer transition-all text-center relative"
                     [class.border-soft-brown]="selectedQuantity === 1"
                     [class.bg-gray-50]="selectedQuantity === 1"
                     [class.border-gray-200]="selectedQuantity !== 1">
                   <div *ngIf="selectedQuantity === 1" class="absolute -top-2 -right-2 bg-black text-white rounded-full p-0.5">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                   </div>
                   <div class="font-bold text-gray-900">1 unid.</div>
                   <div class="text-xs text-soft-brown font-bold">R$ {{ product.price.toFixed(0) }}/un</div>
                </div>
                
                <div (click)="selectedQuantity = 3"
                     class="border rounded-lg p-3 cursor-pointer transition-all text-center relative"
                     [class.border-soft-brown]="selectedQuantity === 3"
                     [class.bg-gray-50]="selectedQuantity === 3"
                     [class.border-gray-200]="selectedQuantity !== 3">
                   <div *ngIf="selectedQuantity === 3" class="absolute -top-2 -right-2 bg-black text-white rounded-full p-0.5">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                   </div>
                   <div class="font-bold text-gray-900">Kit 3</div>
                   <div class="text-xs text-soft-brown font-bold">R$ {{ (product.price * 0.9).toFixed(0) }}/un</div>
                </div>

                <div (click)="selectedQuantity = 5"
                     class="border rounded-lg p-3 cursor-pointer transition-all text-center relative"
                     [class.border-soft-brown]="selectedQuantity === 5"
                     [class.bg-gray-50]="selectedQuantity === 5"
                     [class.border-gray-200]="selectedQuantity !== 5">
                   <div *ngIf="selectedQuantity === 5" class="absolute -top-2 -right-2 bg-black text-white rounded-full p-0.5">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                   </div>
                   <div class="font-bold text-gray-900">Kit 5</div>
                   <div class="text-xs text-soft-brown font-bold">R$ {{ (product.price * 0.85).toFixed(0) }}/un</div>
                </div>
              </div>
            </div>

            <!-- Actions (Desktop / Main) -->
            <button #addToCartBtn (click)="addToCart(product)" class="btn btn-primary btn-block bg-black hover:bg-gray-800 text-white border-none h-14 text-base font-bold uppercase tracking-wide rounded-md">
              ADICIONAR AO CARRINHO
            </button>

          </div>
        </div>

      </div>

      <ng-template #loading>
        <div class="flex justify-center items-center min-h-[50vh]">
          <span class="loading loading-spinner loading-lg text-soft-brown"></span>
        </div>
      </ng-template>

      <!-- Sticky Mobile Buy Button -->
      <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:hidden z-40 transition-transform duration-300"
           [class.translate-y-full]="!showStickyButton"
           [class.translate-y-0]="showStickyButton"
           *ngIf="product$ | async as product">
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <div class="text-xs text-gray-500 font-bold uppercase mb-1">{{ product.name }}</div>
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold text-soft-brown">R$ {{ product.price.toFixed(2) }}</span>
              <span *ngIf="product.originalPrice" class="text-xs text-gray-400 line-through">R$ {{ product.originalPrice.toFixed(2) }}</span>
            </div>
          </div>
          <button (click)="addToCart(product)" class="btn btn-primary bg-black hover:bg-gray-800 text-white border-none px-6 font-bold uppercase">
            Comprar
          </button>
        </div>
      </div>

    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product$: Observable<Product | undefined>;

  // Mock Options
  flavors = [
    { name: 'Chocolate Belga', color: '#3E2723', isNew: false },
    { name: 'Baunilha', color: '#F5F5DC', isNew: false },
    { name: 'Morango', color: '#D81B60', isNew: true },
    { name: 'Pistache', color: '#9CCC65', isNew: false },
    { name: 'Doce de Leite', color: '#8D6E63', isNew: false },
    { name: 'Limão Siciliano', color: '#FFF59D', isNew: true },
  ];
  selectedFlavor = 'Chocolate Belga';

  sizes = ['P', 'M', 'G', 'GG'];
  selectedSize = 'M';

  selectedQuantity = 1;

  // Carousel State
  images: string[] = [];
  currentImageIndex = 0;

  // Sticky Button State
  showStickyButton = false;
  @ViewChild('addToCartBtn') addToCartBtn!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private productsRepo: ProductsRepository,
    private cartRepo: CartRepository
  ) {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.productsRepo.products$.pipe(
            map(products => {
              const product = products.find(p => p.id === id);
              if (product) {
                // Enrich with mock data if missing
                const enriched = {
                  ...product,
                  originalPrice: product.originalPrice || product.price * 1.2,
                  rating: product.rating || 4.9,
                  reviews: product.reviews || 120,
                  isNew: product.isNew
                };

                // Initialize mock images
                this.images = [
                  product.image,
                  product.image, // Mock duplicate for carousel demo
                  product.image,
                  product.image
                ];

                return enriched;
              }
              return undefined;
            })
          );
        }
        return of(undefined);
      })
    );
  }

  ngOnInit() {
    this.productsRepo.load();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.addToCartBtn) {
      const rect = this.addToCartBtn.nativeElement.getBoundingClientRect();
      // Show sticky button when the main button scrolls out of view (top < 0)
      // or is very close to the top.
      // Actually, we want it to show when we scroll PAST the button.
      // rect.bottom < 0 means the button has scrolled up off the screen.
      this.showStickyButton = rect.bottom < 60; // 60px buffer (header height approx)
    }
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  addToCart(product: Product) {
    console.log('Adding to cart:', {
      product,
      flavor: this.selectedFlavor,
      size: this.selectedSize,
      quantity: this.selectedQuantity
    });

    for (let i = 0; i < this.selectedQuantity; i++) {
      this.cartRepo.addItem(product);
    }
  }

  calculateDiscount(product: Product): number {
    if (!product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }
}
