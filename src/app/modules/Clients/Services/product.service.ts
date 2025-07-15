import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product } from '../Models/Product.model';
import {
  ProductSearchRequest,
  ProductSearchResult,
} from '../Models/Product-Filter.model';

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

  // Keep the original method for backward compatibility
  getProducts(): Observable<Product[]> {
    return this.http
      .get<APIResponse<Product[]>>(this.baseUrl)
      .pipe(map((response) => response.Data));
  }

  // Add new search method
  searchProducts(
    searchRequest: ProductSearchRequest
  ): Observable<ProductSearchResult> {
    console.log(
      '🔍 ProductService: Starting search with request:',
      searchRequest
    );

    return this.http
      .post<APIResponse<any>>(`${this.baseUrl}/search`, searchRequest)
      .pipe(
        map((response) => {
          console.log('🔍 ProductService: Raw API response:', response);
          console.log('🔍 ProductService: Response.Data:', response.Data);
          console.log(
            '🔍 ProductService: Response.Data.Products:',
            response.Data?.Products
          );
          console.log(
            '🔍 ProductService: Response.Data.Products length:',
            response.Data?.Products?.length
          );

          // Map backend PascalCase response to frontend camelCase
          const mappedResult = {
            Products: response.Data?.Products || [],
            TotalItems: response.Data?.TotalItems || 0,
            PageNumber: response.Data?.PageNumber || 1,
            PageSize: response.Data?.PageSize || 12,
            TotalPages: response.Data?.TotalPages || 0,
            HasNextPage: response.Data?.HasNextPage || false,
            HasPreviousPage: response.Data?.HasPreviousPage || false,
          } as ProductSearchResult;

          console.log('🔍 ProductService: Mapped result:', mappedResult);
          console.log(
            '🔍 ProductService: Mapped Products length:',
            mappedResult.Products.length
          );

          return mappedResult;
        })
      );
  }

  // Get available categories
  getCategories(): Observable<string[]> {
    return this.http
      .get<APIResponse<string[]>>(`${this.baseUrl}/categories`)
      .pipe(map((response) => response.Data || []));
  }

  // Get available brands
  getBrands(): Observable<string[]> {
    return this.http
      .get<APIResponse<string[]>>(`${this.baseUrl}/brands`)
      .pipe(map((response) => response.Data || []));
  }

  getProductById(id: number): Observable<Product> {
    console.log(`Fetching product with ID: ${id}`);
    return this.http
      .get<APIResponse<Product>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => response.Data));
  }
}
