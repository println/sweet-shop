import { createStore } from '@ngneat/elf';
import { selectAllEntities, setEntities, withEntities } from '@ngneat/elf-entities';
import { Injectable } from '@angular/core';
import { Product } from '../../domain/models/product.model';
import { CsvService } from '../../infrastructure/services/csv.service';
import { AppSettings } from '../../config/app.config';

@Injectable({ providedIn: 'root' })
export class ProductsRepository {
    private store = createStore(
        { name: 'products' },
        withEntities<Product>()
    );

    products$ = this.store.pipe(selectAllEntities());

    constructor(private csvService: CsvService) { }

    setProducts(products: Product[]) {
        this.store.update(setEntities(products));
    }

    load() {
        this.csvService.loadProducts(AppSettings.products.csvUrl).subscribe({
            next: (products) => this.setProducts(products),
            error: (err) => console.error('Failed to load products', err)
        });
    }
}
