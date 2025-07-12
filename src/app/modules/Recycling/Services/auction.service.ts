import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuctionVM } from '../Models/AuctionVM';
import { RecyclerVM } from '../Models/RecyclerVM';
import { AuctionRoomVM } from '../Models/auction-room-vm';
import { APIResponse } from '../../../core/models/APIResponse';

@Injectable({ providedIn: 'root' })
export class AuctionService {
  private api = 'http://localhost:5037/api/auction';
  private baseUrl = 'http://localhost:5037/api';

  constructor(private http: HttpClient) {}

  getActiveAuctions(): Observable<APIResponse<AuctionVM[]>> {
    return this.http.get<APIResponse<AuctionVM[]>>(`${this.baseUrl}/Auction/active`);
  }

  // New method to get all auctions in the system
  getAllAuctions(): Observable<APIResponse<AuctionVM[]>> {
    return this.http.get<APIResponse<AuctionVM[]>>(`${this.baseUrl}/Auction/AllAuctions`);
  }

  // New method to get auctions with pagination and filters
  getAuctionsWithFilters(city?: string, pageSize: number = 10, pageNumber: number = 1): Observable<APIResponse<AuctionVM[]>> {
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNumber', pageNumber.toString());
    
    if (city) {
      params = params.set('city', city);
    }
    
    return this.http.get<APIResponse<AuctionVM[]>>(`${this.baseUrl}/AuctionRequest/GetAuctions`, { params });
  }

  getAuctionById(id: number): Observable<AuctionVM> {
    return this.http.get<{ data: AuctionVM }>(`${this.api}/${id}`).pipe(map(res => res.data));
  }

  // New method to get auction details using the new API endpoint
  getAuctionDetails(id: number): Observable<APIResponse<AuctionRoomVM>> {
    return this.http.get<APIResponse<AuctionRoomVM>>(`${this.baseUrl}/Auction/${id}`);
  }

  
  getAuctionWinner(id: number): Observable<RecyclerVM> {
    return this.http.get<{ data: RecyclerVM }>(`${this.api}/${id}/winner`).pipe(map(res => res.data));
  }

  /**
   * Get active auctions count
   * @returns Observable of number of active auctions
   */
  getActiveAuctionsCount(): Observable<number> {
    return new Observable(observer => {
      this.getActiveAuctions().subscribe({
        next: (result) => {
          if (result.IsSuccess) {
            observer.next(result.Data.length);
          } else {
            observer.next(0);
          }
          observer.complete();
        },
        error: (error) => {
          console.error('Error getting active auctions count:', error);
          observer.next(0);
          observer.complete();
        }
      });
    });
  }

  /**
   * Get active auctions by material type
   * @param materialId - The material ID to filter by
   * @returns Observable of APIResponse containing filtered active auctions
   */
  getActiveAuctionsByMaterial(materialId: number): Observable<APIResponse<AuctionVM[]>> {
    return new Observable(observer => {
      this.getActiveAuctions().subscribe({
        next: (result) => {
          if (result.IsSuccess) {
            const filteredAuctions = result.Data.filter((auction: AuctionVM) => auction.materialId === materialId);
            observer.next({
              IsSuccess: true,
              Data: filteredAuctions,
              Message: `Found ${filteredAuctions.length} active auctions for material ${materialId}`,
              StatusCode: 200
            });
          } else {
            observer.next(result);
          }
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Get active auctions by governorate
   * @param governorate - The governorate to filter by
   * @returns Observable of APIResponse containing filtered active auctions
   */
  getActiveAuctionsByGovernorate(governorate: string): Observable<APIResponse<AuctionVM[]>> {
    return new Observable(observer => {
      this.getActiveAuctions().subscribe({
        next: (result) => {
          if (result.IsSuccess) {
            const filteredAuctions = result.Data.filter((auction: AuctionVM) => 
              auction.governorateName === governorate
            );
            observer.next({
              IsSuccess: true,
              Data: filteredAuctions,
              Message: `Found ${filteredAuctions.length} active auctions in ${governorate}`,
              StatusCode: 200
            });
          } else {
            observer.next(result);
          }
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  // New method to get total auction count
  getAllAuctionCount(): Observable<APIResponse<number>> {
    return this.http.get<APIResponse<number>>(`${this.baseUrl}/Auction/AllAuctionCount`);
  }

  // New method to get active auction count
  getActiveAuctionCount(): Observable<APIResponse<number>> {
    return this.http.get<APIResponse<number>>(`${this.baseUrl}/Auction/AllActiveAuctionCount`);
  }

  // New method to get won auction count for current recycler
  getWonAuctionCount(): Observable<APIResponse<number>> {
    return this.http.get<APIResponse<number>>(`${this.baseUrl}/Auction/countAuctionwin`);
  }
}
