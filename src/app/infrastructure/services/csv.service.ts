import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import * as Papa from 'papaparse';
import { Product } from '../../domain/models/product.model';

@Injectable({
    providedIn: 'root'
})
export class CsvService {
    constructor(private http: HttpClient) { }

    loadProducts(url: string): Observable<Product[]> {
        return this.http.get(url, { responseType: 'text' }).pipe(
            map(csv => {
                const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
                // Map CSV fields to Product model if necessary, for now assuming direct match
                return parsed.data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: parseFloat(item.price),
                    image: item.image,
                    category: item.category,
                    tags: item.tags ? item.tags.split(',') : []
                })) as Product[];
            }),
            catchError(error => {
                console.error('Error loading CSV:', error);
                return of([]); // Return empty array on error
            })
        );
    }
}
