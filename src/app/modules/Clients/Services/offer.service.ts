import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { APIResponse } from '../../../core/models/APIResponse';
import { PaginationResponse } from '../Models/PaginationResponse';
import { OfferViewModel } from '../Models/OfferViewModel';
import { Product } from '../Models/Product.model';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private readonly baseUrl = `${environment.apiUrl}/Offers`;

  constructor(private http: HttpClient) { }

  getAllOffers(pageSize = 10, pageNumber = 1): Observable<PaginationResponse<OfferViewModel>> {
    const params = {
      pageSize: pageSize.toString(),
      pageNumber: pageNumber.toString()
    };

    return this.http.get<APIResponse<any>>(`${this.baseUrl}/GetAllOffers`, { params }).pipe(
      tap(response => {
        console.log('API Response from GetAllOffers:', response);
      }),
      map(response => {
        if (response && response.Data) {
          const backendResponse = response.Data;
          return {
            data: backendResponse.Data || [],
            pageNumber: backendResponse.PageNumber,
            pageSize: backendResponse.PageSize,
            totalCount: backendResponse.TotalCount,
            totalPages: Math.ceil(backendResponse.TotalCount / backendResponse.PageSize),
            hasNextPage: backendResponse.PageNumber < Math.ceil(backendResponse.TotalCount / backendResponse.PageSize),
            hasPreviousPage: backendResponse.PageNumber > 1
          } as PaginationResponse<OfferViewModel>;
        }
        // Return a default empty response if data is not valid
        return {
          data: [], pageNumber: 1, pageSize: pageSize, totalCount: 0,
          totalPages: 0, hasNextPage: false, hasPreviousPage: false
        } as PaginationResponse<OfferViewModel>;
      }),
      catchError(error => {
        console.error('Error fetching all offers:', error);
        throw error;
      })
    );
  }

  getOfferDetails(offerId: number): Observable<OfferViewModel> {
    return this.http.get<APIResponse<OfferViewModel>>(`${this.baseUrl}/GetOfferDetails/${offerId}`).pipe(
      map(response => {
        if(response && response.Data) {
          return response.Data;
        }
        throw new Error('Invalid offer data received from server.');
      }),
      catchError(error => {
        console.error(`Error fetching offer details for id ${offerId}:`, error);
        throw error;
      })
    );
  }

  /**
   * Get products by offer ID
   * @param offerId The ID of the offer to get products for
   * @returns Observable of Product array
   */
  getProductsByOfferId(offerId: number): Observable<Product[]> {
    if (!offerId || offerId <= 0) {
      return throwError(() => new Error('Invalid offer ID'));
    }

    return this.http.get<APIResponse<any[]>>(`${this.baseUrl}/GetProductByOffer/${offerId}`)
      .pipe(
        tap(response => console.log('Raw getProductsByOfferId response:', response)),
        map(response => {
          if (response && response.Data && Array.isArray(response.Data)) {
            return response.Data.map(product => ({
              Id: product.Id,
              Name: product.Name,
              Description: product.Description,
              Stock: product.Stock,
              BasePrice: product.BasePrice,
              Points: product.Points,
              CategoryName: product.CategoryName,
              ShopName: product.ShopName,
              CreatedAt: product.CreatedAt,
              Images: product.Images,
              ModificationDate: product.ModificationDate,
              CategoryId: product.CategoryId,
              DisplayedPrice: product.DisplayedPrice,
              DisplayedPriceAfterDiscount: product.DisplayedPriceAfterDiscount,
              EarnedPoints: product.EarnedPoints
            } as Product));
          }
          console.warn('[OfferService] Response data is not an array. Returning empty product list.', response.Data);
          return [];
        }),
        catchError(error => {
          console.error(`Error fetching products for offer ${offerId}:`, error);
          throw error;
        })
      );
  }
} 