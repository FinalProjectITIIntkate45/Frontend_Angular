import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuctionVM } from '../Models/AuctionVM';
import { APIResponse } from '../../../core/models/APIResponse';

@Injectable({
  providedIn: 'root'
})
export class ActiveAuctionsService {
  private baseUrl = 'http://localhost:5037/api';

  constructor(private http: HttpClient) { }

  getActiveAuctions(): Observable<APIResponse<AuctionVM[]>> {
    return this.http.get<APIResponse<AuctionVM[]>>(`${this.baseUrl}/Auction/GetActiveAuction`);
  }
} 