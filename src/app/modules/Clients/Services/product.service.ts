import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductFilter } from '../Models/Product-Filter.model';
import { Product } from '../Models/Product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(filter: ProductFilter): Observable<Product[]> {
    let params = new HttpParams();

    if (filter.category) params = params.append('category', filter.category);
    if (filter.minPrice)
      params = params.append('minPrice', filter.minPrice.toString());
    if (filter.maxPrice)
      params = params.append('maxPrice', filter.maxPrice.toString());
    if (filter.minPoints)
      params = params.append('minPoints', filter.minPoints.toString());
    if (filter.maxPoints)
      params = params.append('maxPoints', filter.maxPoints.toString());
    if (filter.search) params = params.append('search', filter.search);
    if (filter.sortBy) params = params.append('sortBy', filter.sortBy);

    return this.http.get<Product[]>(this.baseUrl, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }
}
