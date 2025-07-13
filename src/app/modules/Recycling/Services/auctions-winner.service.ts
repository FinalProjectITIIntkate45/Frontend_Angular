import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuctionRoomVM } from '../Models/auction-room-vm';
import { APIResponse } from '../../../core/models/APIResponse';

@Injectable({
  providedIn: 'root'
})
export class AuctionsWinnerService {
  private baseUrl = 'http://localhost:5037/api/AuctionBid';

  constructor(private http: HttpClient) { }

  getAllAuctionsForWinner(): Observable<APIResponse<AuctionRoomVM[]>> {
    return this.http.get<APIResponse<AuctionRoomVM[]>>(`${this.baseUrl}/GetAllAuctionsForWinner`);
  }
}
