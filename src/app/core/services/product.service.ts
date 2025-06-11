// src/app/modules/vendor/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { APIResponse } from '../models/APIResponse';
import { CreateProductRequest } from '../models/create-product-request.model';
import { EditProductRequest } from '../models/edit-product-request.model';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) {}

  // ✅ 1. Get all products
  getAll(): Observable<Product[]> {
  return this.http.get<APIResponse<Product[]>>(this.baseUrl).pipe(
    map(response => response.Data ?? [])
  );
}


  // ✅ 2. Get product by ID
  getById(id: number): Observable<Product> {
    return this.http
      .get<APIResponse<Product>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => response.Data));
  }

  // ✅ 3. Create product (with images + attributes) using FormData
  createProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }

  // ✅ 4. Update product
  updateProduct(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  // ✅ 5. Delete product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
