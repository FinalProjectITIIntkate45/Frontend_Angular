import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product } from '../Models/Product.model';

interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = `${environment.apiUrl}/Product`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<APIResponse<Product[]>>(`${this.baseUrl}/GetProducts`)
      .pipe(map((response) => response.data));
  }

  getProductById(id: number): Observable<Product> {
    return this.http
      .get<APIResponse<Product>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => response.data));
  }
}
