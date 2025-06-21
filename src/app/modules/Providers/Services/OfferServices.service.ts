import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ProductDetailsViewModel } from '../Models/ProductDetailsViewModel';
import { PaginationResponse } from '../Models/PaginationResponse';
import { Offer } from '../Models/Offer';
import { AddOffer } from '../Models/AddOffer';
import { OfferProduct } from '../Models/OfferProduct';
import { OfferViewModel } from '../Models/OfferViewModel';
import { AddOfferProductVM } from '../Models/AddOfferProductVM';
import { EditOfferProductVM } from '../Models/EditOfferProductVM';
import { APIResponse } from '../../../core/models/APIResponse';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  private readonly baseUrl = `${environment.apiUrl}/Offers`;

  constructor(private http: HttpClient) { }

  /**
   * Get all shop products
   * @returns Observable of ProductDetailsViewModel array
   */
  getShopProducts(): Observable<ProductDetailsViewModel[]> {
    return this.http.get<APIResponse<any[]>>(`${this.baseUrl}/getshopproduct`)
      .pipe(
        tap(response => {
          console.log('[OfferService] Raw response from getshopproduct:', response);
        }),
        map(response => {
          // Check if the data is an array before mapping
          if (response && response.Data && Array.isArray(response.Data)) {
            console.log('[OfferService] Mapping product data.');
            return response.Data.map(product => ({
              id: product.Id,
              name: product.Name,
              description: product.Description,
              stock: product.Stock,
              basePrice: product.BasePrice,
              points: product.Points,
              categoryName: product.CategoryName,
              shopName: product.ShopName,
              createdAt: product.CreatedAt,
              images: product.Images,
              modificationDate: product.ModificationDate,
              categoryId: product.CategoryId,
              displayedPrice: product.DisplayedPrice,
              displayedPriceAfterDiscount: product.DisplayedPriceAfterDiscount,
              isSpecialOffer: product.IsSpecialOffer,
              earnedPoints: product.EarnedPoints
            } as ProductDetailsViewModel));
          }
          // If data is not an array (e.g., "User not authenticated" string), return an empty array.
          console.warn('[OfferService] Response data is not an array. Returning empty product list.', response.Data);
          return [];
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get paginated shop offers
   * @param pageSize Number of items per page (default: 10)
   * @param pageNumber Current page number (default: 1)
   * @returns Observable of PaginationResponse containing offers
   */
  getShopOffers(pageSize = 10, pageNumber = 1): Observable<PaginationResponse<OfferViewModel>> {
    const params = {
      pageSize: pageSize.toString(),
      pageNumber: pageNumber.toString()
    };

    return this.http.get<APIResponse<any>>(`${this.baseUrl}/GetShopOffers`, { params })
      .pipe(
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
          return {
            data: [],
            pageNumber: 1,
            pageSize: pageSize,
            totalCount: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false
          } as PaginationResponse<OfferViewModel>;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get all offers (for clients)
   * @param pageSize Number of items per page (default: 10)
   * @param pageNumber Current page number (default: 1)
   * @returns Observable of PaginationResponse containing offers
   */
  getAllOffers(pageSize = 10, pageNumber = 1): Observable<PaginationResponse<OfferViewModel>> {
    const params = {
      pageSize: pageSize.toString(),
      pageNumber: pageNumber.toString()
    };

    return this.http.get<APIResponse<any>>(`${this.baseUrl}/GetAllOffers`, { params })
      .pipe(
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
          return {
            data: [],
            pageNumber: 1,
            pageSize: pageSize,
            totalCount: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false
          } as PaginationResponse<OfferViewModel>;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get details of a specific offer
   * @param offerId The ID of the offer to retrieve
   * @returns Observable of OfferViewModel
   */
  getOfferDetails(offerId: number): Observable<OfferViewModel> {
    if (!offerId || offerId <= 0) {
      return throwError(() => new Error('Invalid offer ID'));
    }

    return this.http.get<APIResponse<any>>(`${this.baseUrl}/GetOfferDetails/${offerId}`)
      .pipe(
        tap(response => console.log('Raw getOfferDetails response:', JSON.stringify(response, null, 2))),
        map(response => {
          if (response && response.Data) {
            const offer = response.Data;
            return {
              Id: offer.Id,
              OfferImgUrl: offer.OfferImgUrl,
              Status: offer.Status,
              OldPrice: offer.OldPrice,
              NewPrice: offer.NewPrice,
              OldPoints: offer.OldPoints,
              NewPoints: offer.NewPoints,
              StartDate: offer.StartDate,
              EndDate: offer.EndDate,
              Products: offer.Products?.map((p: any) => ({
                Id: p.Id,
                ProductId: p.ProductId,
                ProductName: p.Productname,
                ProductQuantity: p.ProductQuantity,
                Type: p.Type
              })) || []
            } as OfferViewModel;
          }
          throw new Error('Invalid offer data');
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get products by offer ID
   * @param offerId The ID of the offer to get products for
   * @returns Observable of ProductDetailsViewModel array
   */
  getProductsByOfferId(offerId: number): Observable<ProductDetailsViewModel[]> {
    if (!offerId || offerId <= 0) {
      return throwError(() => new Error('Invalid offer ID'));
    }

    return this.http.get<APIResponse<any[]>>(`${this.baseUrl}/GetProductByOffer/${offerId}`)
      .pipe(
        tap(response => console.log('Raw getProductsByOfferId response:', response)),
        map(response => {
          if (response && response.Data && Array.isArray(response.Data)) {
            return response.Data.map(product => ({
              id: product.Id,
              name: product.Name,
              description: product.Description,
              stock: product.Stock,
              basePrice: product.BasePrice,
              points: product.Points,
              categoryName: product.CategoryName,
              shopName: product.ShopName,
              createdAt: product.CreatedAt,
              images: product.Images,
              modificationDate: product.ModificationDate,
              categoryId: product.CategoryId,
              displayedPrice: product.DisplayedPrice,
              displayedPriceAfterDiscount: product.DisplayedPriceAfterDiscount,
              isSpecialOffer: product.IsSpecialOffer,
              earnedPoints: product.EarnedPoints
            } as ProductDetailsViewModel));
          }
          console.warn('[OfferService] Response data is not an array. Returning empty product list.', response.Data);
          return [];
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Add a new offer with file handling
   * @param offer The offer object to add
   * @returns Observable of void
   */
  addNewOffer(offer: AddOffer): Observable<void> {
    const formData = new FormData();

    if (offer.file) {
      formData.append('file', offer.file, offer.file.name);
      formData.append('OfferImgUrl', offer.file.name);
    } else {
      formData.append('OfferImgUrl', '');
    }

    formData.append('Status', offer.Status.toString());
    formData.append('OldPrice', offer.OldPrice.toString());
    formData.append('NewPrice', offer.NewPrice.toString());
    formData.append('OldPoints', offer.OldPoints.toString());
    formData.append('NewPoints', offer.NewPoints.toString());
    formData.append('StartDate', offer.StartDate);
    formData.append('EndDate', offer.EndDate);

    // Match backend `Products` list and its properties
    offer.Products.forEach((p, index) => {
      formData.append(`Products[${index}].ProductId`, p.ProductId.toString());
      if (p.ProductName) {
        formData.append(`Products[${index}].ProductName`, p.ProductName);
      }
      formData.append(`Products[${index}].ProductQuantity`, p.ProductQuantity.toString());
      formData.append(`Products[${index}].Type`, p.Type.toString());
    });

    return this.http.post<void>(`${this.baseUrl}/AddNewOffer`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete an offer and its associated products
   * @param offerId The ID of the offer to delete
   * @returns Observable of void
   */
  deleteOffer(offerId: number): Observable<void> {
    if (!offerId || offerId <= 0) {
      return throwError(() => new Error('Invalid offer ID'));
    }

    return this.http.delete<void>(`${this.baseUrl}/DeleteOfferWithProducts/${offerId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Add a product to an existing offer
   * @param product The product to add to the offer
   * @returns Observable of void
   */
  addProductToOffer(product: AddOfferProductVM): Observable<void> {
    if (!product || !product.ProductId || product.ProductQuantity <= 0 || !product.offerid) {
      return throwError(() => new Error('Invalid product data'));
    }

    const formData = new FormData();
    formData.append('ProductId', product.ProductId.toString());
    if (product.ProductName) {
      formData.append('ProductName', product.ProductName);
    }
    formData.append('ProductQuantity', product.ProductQuantity.toString());
    formData.append('Type', product.Type.toString());
    formData.append('offerid', product.offerid.toString()); // Match backend 'offerid'

    return this.http.post<void>(`${this.baseUrl}/AddProductToOffer`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing offer product
   * @param product The product to update
   * @returns Observable of void
   */
  updateOfferProduct(product: EditOfferProductVM): Observable<void> {
    if (!product || !product.ProductId || product.ProductQuantity <= 0 || !product.offerid || !product.Id) {
      return throwError(() => new Error('Invalid product data'));
    }

    const formData = new FormData();
    formData.append('Id', product.Id.toString());
    formData.append('ProductId', product.ProductId.toString());
    formData.append('ProductQuantity', product.ProductQuantity.toString());
    formData.append('Type', product.Type.toString());
    formData.append('offerid', product.offerid.toString()); // Match backend 'offerid'

    return this.http.put<void>(`${this.baseUrl}/UpdateOfferProduct`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete a product from an offer
   * @param id The ID of the product to delete from the offer
   * @returns Observable of void
   */
  deleteOfferProduct(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('Invalid product ID'));
    }

    return this.http.delete<void>(`${this.baseUrl}/DeletProductFromOffer/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing offer with file handling
   * @param offer The offer object to update
   * @returns Observable of void
   */
  updateOffer(offer: OfferViewModel): Observable<void> {
    const formData = new FormData();

    if (offer.file) {
      formData.append('file', offer.file);
    }

    formData.append('Id', offer.Id.toString());
    formData.append('Status', offer.Status.toString());
    formData.append('OldPrice', offer.OldPrice.toString());
    formData.append('NewPrice', offer.NewPrice.toString());
    formData.append('OldPoints', offer.OldPoints.toString());
    formData.append('NewPoints', offer.NewPoints.toString());
    formData.append('StartDate', offer.StartDate);
    formData.append('EndDate', offer.EndDate);
    
    if (offer.OfferImgUrl) {
      formData.append('OfferImgUrl', offer.OfferImgUrl);
    }

    // Match backend `Products` list and its properties
    offer.Products.forEach((p, index) => {
      formData.append(`Products[${index}].ProductId`, p.ProductId.toString());
      if (p.ProductName) {
        formData.append(`Products[${index}].ProductName`, p.ProductName);
      }
      formData.append(`Products[${index}].ProductQuantity`, p.ProductQuantity.toString());
      formData.append(`Products[${index}].Type`, p.Type.toString());
    });

    return this.http.put<void>(`${this.baseUrl}/UpdateOffer/${offer.Id}`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   * @param error The HTTP error response
   * @returns Observable that throws the error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    // Log the entire error object for debugging
    console.error('Full API Error Response:', error);

    if (error.status === 400 && error.error && typeof error.error === 'object') {
      // This is likely a validation error from the backend.
      const validationErrors = error.error.errors || error.error;
      let errorDetails = '';
      for (const key in validationErrors) {
        if (validationErrors.hasOwnProperty(key)) {
          errorDetails += `${key}: ${validationErrors[key]}\n`;
        }
      }
      errorMessage = `Validation failed:\n${errorDetails}`;
      console.error('Validation Errors:', validationErrors);
    } else if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `A client-side error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Server returned code ${error.status}, error message is: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}