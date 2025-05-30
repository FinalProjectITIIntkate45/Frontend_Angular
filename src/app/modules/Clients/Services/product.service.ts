import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product } from '../Models/Product.model';

interface APIResponse<T> {
  Data: T;
  StatusCode: number;
  Message: string;
  IsSuccess: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<APIResponse<Product[]>>(this.baseUrl)
      .pipe(map((response) => response.Data)); // Changed from 'data' to 'Data'
  }

  getProductById(id: number): Observable<Product> {
    return this.http
      .get<APIResponse<Product>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => response.Data)); // Changed from 'data' to 'Data'
  }
}
