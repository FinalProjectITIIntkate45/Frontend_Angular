import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { APIResponse } from '../../../core/models/APIResponse';
import { AuctionVM } from '../Models/auction-vm.model';
import { AuctionRecyclingRequestVM } from '../Models/auction-recycling-request.model';
import { JoinAuctionViewModel } from '../Models/scrap-auction.model';
import { AuctionRecyclingRequestDisplyVM } from '../Models/auction-recycling-request-display.model';
import { AuctionRecyclingStatus } from '../Models/auction-recycling-status.model';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Get all auctions for Recyclers
  getAllAuctions(city: string, pageSize: number = 10, pageNumber: number = 1): Observable<AuctionVM[]> {
    const params = {
      city: city,
      pageSize: pageSize.toString(),
      pageNumber: pageNumber.toString()
    };

    return this.http
      .get<APIResponse<AuctionVM[]>>(`${this.baseUrl}/AuctionRequest/GetAuctions`, { params })
      .pipe(
        map((response) => {
          console.log('Auctions response:', response);
          return response.Data || [];
        }),
        catchError((error) => {
          console.error('Error fetching auctions:', error);
          throw error;
        })
      );
  }

  // Join an auction with insurance payment from wallet
  joinAuctionWithInsurance(auctionId: number): Observable<APIResponse<string>> {
    const formData = new FormData();
    formData.append('AuctionId', auctionId.toString());
    
    return this.http
      .post<APIResponse<string>>(`${this.baseUrl}/AuctionRequest/asktojoin`, formData)
      .pipe(
        map((response) => {
          console.log('Join auction with insurance response:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Error joining auction with insurance:', error);
          throw error;
        })
      );
  }

  // Withdraw request from auction
  withdrawRequest(recyclingRequestId: number, auctionId: number): Observable<APIResponse<boolean>> {
    const withdrawRequest: JoinAuctionViewModel = {
      recyclingRequestId: recyclingRequestId,
      auctionId: auctionId
    };

    return this.http
      .post<APIResponse<boolean>>(`${this.baseUrl}/AuctionRequest/withdraw`, withdrawRequest)
      .pipe(
        map((response) => {
          console.log('Withdraw request response:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Error withdrawing request:', error);
          throw error;
        })
      );
  }

  // Get requests by recycler
  getRequestsByRecycler(): Observable<AuctionRecyclingRequestDisplyVM[]> {
    return this.http
      .get<AuctionRecyclingRequestDisplyVM[]>(`${this.baseUrl}/AuctionRequest/RecyclerRequestes`)
      .pipe(
        map((response) => {
          console.log('Recycler requests response:', response);
          return response || [];
        }),
        catchError((error) => {
          console.error('Error fetching recycler requests:', error);
          throw error;
        })
      );
  }

  // Get request status
  getRequestStatus(recyclingRequestId: number): Observable<APIResponse<AuctionRecyclingStatus>> {
    return this.http
      .get<APIResponse<AuctionRecyclingStatus>>(`${this.baseUrl}/AuctionRequest/status/${recyclingRequestId}`)
      .pipe(
        map((response) => {
          console.log('Request status response:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Error fetching request status:', error);
          throw error;
        })
      );
  }

  // Check if user has requests for specific auction
  getRequestsWithAuction(auctionId: number): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.baseUrl}/AuctionRequest/GetRequestswithauction?auctionid=${auctionId}`)
      .pipe(
        map((response) => {
          console.log('Requests with auction response:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Error checking requests with auction:', error);
          throw error;
        })
      );
  }

  // Request to join a pending auction
  requestToJoinAuction(auctionId: number): Observable<APIResponse<string>> {
    const formData = new FormData();
    formData.append('AuctionId', auctionId.toString());
    formData.append('ApprovalTime', new Date().toISOString());
    return this.http
      .post<APIResponse<string>>(`${this.baseUrl}/AuctionRequest/asktojoin`, formData)
      .pipe(
        map((response) => {
          console.log('Request to join auction response:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Error requesting to join auction:', error);
          throw error;
        })
      );
  }
} 