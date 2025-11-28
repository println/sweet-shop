import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as Papa from 'papaparse';
import { Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  private loadProducts() {
    console.log('Attempting to load products from assets/products.csv');
    this.http.get('assets/products.csv', { responseType: 'text' })
      .subscribe({
        next: (data) => {
          console.log('CSV Data loaded:', data);
          Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              console.log('PapaParse result:', result);
              if (result.errors.length > 0) {
                console.error('PapaParse errors:', result.errors);
              }
              const products = result.data
                .filter((item: any) => item.id && item.nome) // Basic validation
                .map((item: any) => ({
                  ...item,
                  preco: parseFloat(item.preco),
                  destaqueHome: parseInt(item.destaqueHome, 10)
                })) as Product[];
              console.log('Parsed products:', products);
              this.productsSubject.next(products);
            },
            error: (error: any) => {
              console.error('Error parsing CSV', error);
            }
          });
        },
        error: (error) => {
          console.error('Error loading CSV file', error);
        }
      });
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.destaqueHome === 1))
    );
  }
}
