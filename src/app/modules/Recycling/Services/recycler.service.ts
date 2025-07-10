import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RecyclerVM } from '../Models/RecyclerVM';
import { APIResponse } from '../../../core/models/APIResponse';
import { AuctionVM } from '../Models/AuctionVM';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecyclerService {
  private baseUrl = `${environment.apiUrl}/Auction`;

  constructor(private http: HttpClient) {}

  getAllAuctionCount(): Observable<APIResponse<number>> {
    return this.http.get<APIResponse<number>>(`${this.baseUrl}/AllAuctionCount`);
  }

  getAllActiveAuctionCount(): Observable<APIResponse<number>> {
    return this.http.get<APIResponse<number>>(`${this.baseUrl}/AllActiveAuctionCount`);
  }

  getWonAuctionCount(): Observable<APIResponse<number>> {
    return this.http.get<APIResponse<number>>(`${this.baseUrl}/countAuctionWin`);
  }

  getActiveAuctions(): Observable<APIResponse<AuctionVM[]>> {
    return this.http.get<APIResponse<AuctionVM[]>>(`${this.baseUrl}/active`);
  }

  getCurrentRecycler(): Observable<APIResponse<RecyclerVM>> {
    return this.http.get<APIResponse<any>>(`${this.baseUrl}/GetRecycler`).pipe(
      map((response) => {
        const data = response.Data;
        // Map PascalCase to camelCase
        const mapped: RecyclerVM = {
          name: data.name ?? data.Name ?? '',
          requestcount: data.requestcount ?? data.Requestcount ?? data.RequestCount ?? 0,
          recyclingCenterName: data.recyclingCenterName ?? data.RecyclingCenterName ?? '',
          penalties: data.penalties ?? data.Penalties ?? 0,
          isdeleted: data.isdeleted ?? data.Isdeleted ?? data.IsDeleted ?? false,
          ispaid: data.ispaid ?? data.Ispaid ?? data.IsPaid ?? false
        };
        return {
          ...response,
          Data: mapped
        };
      })
    );
  }

}
