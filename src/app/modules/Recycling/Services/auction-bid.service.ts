import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuctionBidViewModel} from '../Models/AuctionBidViewModel';
import { BidViewModel} from '../Models/BidViewModel';
import {  RecyclerVM } from '../Models/RecyclerVM';
import { APIResponse } from '../../../core/models/APIResponse';


@Injectable({
  providedIn: 'root'
})
export class AuctionBidService {

  private baseUrl = 'http://localhost:5037/api/AuctionBid'; // عدّل حسب API

  constructor(private http: HttpClient) {}

  placeBid(model: BidViewModel): Observable<any> {
    return this.http.post(`${this.baseUrl}/place`, model);
  }

  getMaxBid(auctionId: number): Observable<AuctionBidViewModel> {
    return this.http.get<AuctionBidViewModel>(`${this.baseUrl}/max/${auctionId}`);
  }

  getAllBids(auctionId: number): Observable<APIResponse<AuctionBidViewModel[]>> {
    return this.http.get<APIResponse<AuctionBidViewModel[]>>(`${this.baseUrl}/all/${auctionId}`);
  }

  getBidCount(auctionId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count/${auctionId}`);
  }

  finalizeAuction(auctionId: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/end/${auctionId}`, {});
  }

  getWinner(auctionId: number): Observable<RecyclerVM> {
    return this.http.get<RecyclerVM>(`${this.baseUrl}/winner/${auctionId}`);
  }

  getWon(): Observable<AuctionBidViewModel[]> {
    return this.http.get<AuctionBidViewModel[]>(`${this.baseUrl}/won`);
  }

  getLost(): Observable<AuctionBidViewModel[]> {
    return this.http.get<AuctionBidViewModel[]>(`${this.baseUrl}/lost`);
  }
}
