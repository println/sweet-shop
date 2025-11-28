import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { Product } from '../../models';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  featuredProducts$: Observable<Product[]>;

  constructor(private productService: ProductService) {
    this.featuredProducts$ = this.productService.getFeaturedProducts();
  }
}
