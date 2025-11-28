import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../models';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  categories$: Observable<string[]>;
  selectedCategory: string = 'Todos';

  constructor(private productService: ProductService) {
    this.products$ = this.productService.getProducts();

    this.categories$ = this.products$.pipe(
      map(products => ['Todos', ...new Set(products.map(p => p.tipo).filter(Boolean))])
    );

    this.filteredProducts$ = this.products$;
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'Todos') {
      this.filteredProducts$ = this.products$;
    } else {
      this.filteredProducts$ = this.products$.pipe(
        map(products => products.filter(p => p.tipo === category))
      );
    }
  }
}
