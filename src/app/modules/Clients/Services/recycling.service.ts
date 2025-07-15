import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { APIResponse } from '../../../core/models/APIResponse';
import {
  RecyclingMaterial,
  UnitOfMeasurementType,
} from '../Models/recycling-material.model';
import {
  RecyclingRequestCreateViewModel,
  RecyclingRequestListItemViewModel,
  RecyclingRequestDetailsViewModel,
  RecyclingRequestAfterAuctionVm,
  ReturnType,
} from '../Models/recycling-request.model';

@Injectable({
  providedIn: 'root',
})
export class RecyclingService {
  private baseUrl = `${environment.apiUrl}`;

  // Add caching for materials (they don't change often)
  private materialsCache$ = new BehaviorSubject<RecyclingMaterial[]>([]);
  private materialsCacheTime = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {}

  // Recycling Materials - Read Only Operations with Caching
  getAllMaterials(): Observable<RecyclingMaterial[]> {
    const now = Date.now();

    // Return cached data if still valid
    if (
      this.materialsCache$.value.length > 0 &&
      now - this.materialsCacheTime < this.CACHE_DURATION
    ) {
      console.log('Returning cached materials');
      return of(this.materialsCache$.value);
    }

    // Fetch fresh data and cache it
    return this.http
      .get<APIResponse<RecyclingMaterial[]>>(
        `${this.baseUrl}/RecyclingMaterialsApi/getall`
      )
      .pipe(
        map((response) => response.Data || []),
        tap((materials) => {
          // Cache the results
          this.materialsCache$.next(materials);
          this.materialsCacheTime = now;
          console.log('Materials cached, count:', materials.length);
        }),
        shareReplay(1), // Share the same response with multiple subscribers
        catchError((error) => {
          console.error('Error fetching materials:', error);
          // Return cached data on error if available
          if (this.materialsCache$.value.length > 0) {
            console.log('Returning cached materials due to error');
            return of(this.materialsCache$.value);
          }
          return of([]);
        })
      );
  }

  // Clear cache when needed (e.g., after creating/updating materials)
  clearMaterialsCache(): void {
    this.materialsCache$.next([]);
    this.materialsCacheTime = 0;
    console.log('Materials cache cleared');
  }

  getMaterialById(id: number): Observable<RecyclingMaterial | null> {
    // Try to get from cache first
    const cachedMaterial = this.materialsCache$.value.find((m) => m.Id === id);
    if (cachedMaterial) {
      return of(cachedMaterial);
    }

    return this.http
      .get<APIResponse<RecyclingMaterial>>(
        `${this.baseUrl}/RecyclingMaterialsApi/${id}`
      )
      .pipe(
        map((response) => response.Data || null),
        catchError((error) => {
          console.error('Error fetching material:', error);
          return of(null);
        })
      );
  }

  // Recycling Requests - Client Operations
  createRequest(request: RecyclingRequestCreateViewModel): Observable<any> {
    // Create request payload matching the API controller's expected structure
    const requestData = {
      materialId: request.MaterialId,        // Note: camelCase for API
      unitType: request.UnitType,
      city: request.City,
      address: request.Address,
      quantity: request.Quantity,
      requestImage: request.RequestImage || null,
      governorate: request.Governorate,
    };

    console.log('Sending recycling request data:', requestData);

    return this.http
      .post<APIResponse<any>>(
        `${this.baseUrl}/RecyclingRequest/CreateRequest`,
        requestData
      )
      .pipe(
        map((response) => {
          console.log('Create request response:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Error creating request:', error);
          throw error;
        })
      );
  }

  // Get user's recycling requests with pagination
  getMyRequests(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<RecyclingRequestListItemViewModel[]> {
    const params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    return this.http
      .get<APIResponse<RecyclingRequestListItemViewModel[]>>(
        `${this.baseUrl}/RecyclingRequest/MyRequests${params}`
      )
      .pipe(
        map((response) => response.Data || []),
        catchError((error) => {
          console.error('Error fetching my requests:', error);
          return of([]);
        })
      );
  }

  // Get specific request details
  getRequestDetails(
    id: number
  ): Observable<RecyclingRequestDetailsViewModel | null> {
    return this.http
      .get<APIResponse<RecyclingRequestDetailsViewModel>>(`${this.baseUrl}/RecyclingRequest/${id}`)
      .pipe(
        map((response) => response.Data || null),
        catchError((error) => {
          console.error('Error fetching request details:', error);
          return of(null);
        })
      );
  }

  // Update request status (for admin/provider)
  updateRequest(id: number, editData: any): Observable<any> {
    // Ensure the payload matches the expected EditViewModel structure with Id
    const updatePayload = {
      ...editData,
      Id: id
    };

    return this.http
      .put<APIResponse<any>>(`${this.baseUrl}/RecyclingRequest/${id}`, updatePayload)
      .pipe(
        map((response) => {
          console.log('Update request response:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Error updating request:', error);
          throw error;
        })
      );
  }

  // Delete a recycling request by ID
  deleteRequest(requestId: number): Observable<any> {
    // Note: The API controller has a bug - it should be [HttpDelete("{id}")] not [HttpDelete("id")]
    // For now, we'll use the correct URL format that should work
    return this.http
      .delete<APIResponse<any>>(`${this.baseUrl}/RecyclingRequest/${requestId}`)
      .pipe(
        map((response) => {
          console.log('Delete request response:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Error deleting request:', error);
          throw error;
        })
      );
  }

  // Get requests after auction
  getRequestAfterAuction(): Observable<RecyclingRequestAfterAuctionVm[]> {
    return this.http
      .get<APIResponse<RecyclingRequestAfterAuctionVm[]>>(
        `${this.baseUrl}/RecyclingRequest/GetRequestAfterAuction`
      )
      .pipe(
        map((response) => response.Data || []),
        catchError((error) => {
          console.error('Error fetching requests after auction:', error);
          return of([]);
        })
      );
  }

  // Choose return type for money transaction
  chooseReturnType(returnType: ReturnType, requestId: number): Observable<any> {
    // إرسال البراميترز في ال query string وليس في body
    return this.http
      .post<APIResponse<any>>(
        `${this.baseUrl}/RecyclingRequest/ChooseTypeForMoneyTransaction?returnType=${returnType}&requestid=${requestId}`,
        {} // body فاضي
      )
      .pipe(
        map((response) => {
          console.log('Choose return type response:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Error choosing return type:', error);
          throw error;
        })
      );
  }

  // Helper method to get unit type display name
  getUnitTypeDisplayName(unitType: UnitOfMeasurementType | number): string {
    // Convert to number if it's a string
    const typeValue =
      typeof unitType === 'string' ? parseInt(unitType) : unitType;

    switch (typeValue) {
      case 1:
        return 'Kilogram';
      case 2:
        return 'Gram';
      case 3:
        return 'Liter';
      case 4:
        return 'Milliliter';
      case 5:
        return 'Piece';
      case 6:
        return 'Meter';
      case 7:
        return 'Centimeter';
      default:
        return 'Unknown';
    }
  }
}