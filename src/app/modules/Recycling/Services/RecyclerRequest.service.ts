import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResult } from '../Models/api-result';
import { AuctionRecyclingRequestVM, JoinAuctionViewModel } from '../Models/auction-recycling-request';
import { AuctionRecyclingRequestDisplyVM } from '../Models/auction-request-display';
import { RecyclingRequestAfterAuctionModel } from '../Models/recycling-request-after-auction';

@Injectable({
  providedIn: 'root'
})
export class RecyclerRequestService {
  private api = 'http://localhost:5037/api/AuctionRequest';

  constructor(private http: HttpClient) { }

  // Create request to join auction
  createRequestToJoin(request: AuctionRecyclingRequestVM): Observable<APIResult<string>> {
    const formData = new FormData();
    formData.append('AuctionId', request.auctionId.toString());
    if (request.approvalTime) {
      formData.append('ApprovalTime', request.approvalTime.toISOString());
    }
    
    return this.http.post<APIResult<string>>(`${this.api}/asktojoin`, formData);
  }

  // Withdraw request from auction
  withdrawRequest(model: JoinAuctionViewModel): Observable<APIResult<boolean>> {
    return this.http.post<APIResult<boolean>>(`${this.api}/withdraw`, model);
  }

  // Get recycler's requests
  getRecyclerRequests(): Observable<AuctionRecyclingRequestDisplyVM[]> {
    return this.http.get<AuctionRecyclingRequestDisplyVM[]>(`${this.api}/RecyclerRequestes`);
  }

  // Check if user has joined an auction
  hasJoinedAuction(auctionId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.api}/GetRequestswithauction?auctionid=${auctionId}`);
  }

  // Get requests for a specific auction (for winners to see who will pay)
  getRequestsForAuction(auctionId: number): Observable<RecyclingRequestAfterAuctionModel[]> {
    return this.http.get<RecyclingRequestAfterAuctionModel[]>(`http://localhost:5037/api/Auction/GetRequestesByAuctionID?auctionId=${auctionId}`);
  }

  approveMoneyTransaction(requestId: number): Observable<any> {
    return this.http.post<any>(
      `http://localhost:5037/api/RecyclingRequest/ApproveMoneyTransaction%20${requestId}`,
      {}
    );
  }
}
