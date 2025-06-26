import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
} from '../Models/recycling-request.model';

@Injectable({
  providedIn: 'root',
})
export class RecyclingService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Recycling Materials - Read Only Operations
  getAllMaterials(): Observable<RecyclingMaterial[]> {
    return this.http
      .get<APIResponse<RecyclingMaterial[]>>(
        `${this.baseUrl}/RecyclingMaterialsApi/getall`
      )
      .pipe(
        map((response) => response.Data || []),
        catchError((error) => {
          console.error('Error fetching materials:', error);
          return of([]); // Return empty array on error
        })
      );
  }

  getMaterialById(id: number): Observable<RecyclingMaterial | null> {
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
    // Send JSON data instead of FormData since backend doesn't handle file uploads
    // Note: Backend extension method needs to be updated to include Address and Quantity fields
    const requestData = {
      MaterialId: request.materialId,
      UnitType: request.unitType,
      City: request.city,
      Address: request.address,
      Quantity: request.quantity,
      RequestImage: request.requestImage || null,
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

  // Get user's recycling requests
  getMyRequests(): Observable<RecyclingRequestListItemViewModel[]> {
    return this.http
      .get<APIResponse<any[]>>(`${this.baseUrl}/RecyclingRequest/MyRequests`)
      .pipe(
        map((response) => {
          console.log('API Response for MyRequests:', response);
          console.log('Raw Data Array:', response.Data);

          // Map PascalCase backend properties to camelCase frontend properties
          const mappedData = (response.Data || []).map((item) => ({
            id: item.Id,
            materialName: item.MaterialName,
            unitType: item.UnitType,
            quantity: item.Quantity,
            status: item.Status,
            pointsAwarded: item.PointsAwarded,
            createdAt: item.CreatedAt,
          }));

          console.log('Mapped Data:', mappedData);
          return mappedData;
        }),
        catchError((error) => {
          console.error('Error fetching my requests:', error);
          return of([]); // Return empty array on error
        })
      );
  }

  // Get specific request details
  getRequestDetails(
    id: number
  ): Observable<RecyclingRequestDetailsViewModel | null> {
    return this.http
      .get<APIResponse<any>>(`${this.baseUrl}/RecyclingRequest/${id}`)
      .pipe(
        map((response) => {
          console.log('Request Details Response:', response);

          if (!response.Data) return null;

          // Map PascalCase backend properties to camelCase frontend properties
          const mappedData = {
            id: response.Data.Id,
            materialName: response.Data.MaterialName,
            unitType: response.Data.UnitType,
            quantity: response.Data.Quantity,
            status: response.Data.Status,
            pointsAwarded: response.Data.PointsAwarded,
            requestImage: response.Data.RequestImage,
            clientUsername: response.Data.ClientUsername,
            createdAt: response.Data.CreatedAt,
          };

          console.log('Mapped Request Details:', mappedData);
          return mappedData;
        }),
        catchError((error) => {
          console.error('Error fetching request details:', error);
          return of(null);
        })
      );
  }

  // Update request status (for admin/provider)
  updateRequest(id: number, editData: any): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/RecyclingRequest/${id}`, editData)
      .pipe(
        catchError((error) => {
          console.error('Error updating request:', error);
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
