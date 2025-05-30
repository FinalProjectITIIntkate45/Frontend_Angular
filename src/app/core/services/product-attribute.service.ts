import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ProductAttribute } from '../models/product-attribute.model';
import { CreateProductAttribute } from '../models/CreateProductAttribute';
import { UpdateProductAttribute } from '../models/UpdateProductAttribute';







@Injectable({
  providedIn: 'root'
})
export class ProductAttributeService {
  private baseUrl = `${environment.apiUrl}/ProductAttributes`;

  constructor(private http: HttpClient) {}

  // ✅ Get all product-attribute bindings
  getAll(): Observable<ProductAttribute[]> {
    return this.http.get<ProductAttribute[]>(this.baseUrl);
  }

  // ✅ Get one by ID
  getById(id: number): Observable<ProductAttribute> {
    return this.http.get<ProductAttribute>(`${this.baseUrl}/${id}`);
  }

  // ✅ Create a product-attribute binding
  create(attribute: CreateProductAttribute): Observable<any> {
    return this.http.post(this.baseUrl, attribute);
  }

  // ✅ Update
  update(id: number, attribute: UpdateProductAttribute): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, attribute);
  }
}
