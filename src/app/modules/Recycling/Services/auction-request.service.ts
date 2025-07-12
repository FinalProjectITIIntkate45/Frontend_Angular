import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuctionVM } from '../Models/AuctionVM';
import { APIResult } from '../Models/api-result';
import { AuctionRecyclingRequestDisplyVM } from '../Models/auction-request-display';
import { JoinAuctionViewModel } from '../Models/join-auction';

@Injectable({ providedIn: 'root' })
export class AuctionRequestService {
  private api = 'http://localhost:5037/api/AuctionRequest';

  constructor(private http: HttpClient) {}

  // 1. Get paginated auctions (this method is now handled by AuctionService)
  getPaginatedAuctions(city: string, pageSize: number, pageNumber: number): Observable<AuctionVM[]> {
    return this.http.get<{ data: AuctionVM[] }>(
      `${this.api}/GetAuctions?city=${city}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    ).pipe(map(res => res.data));
  }

  // 2. Join auction
  joinAuction(data: FormData): Observable<APIResult<string>> {
    return this.http.post<APIResult<string>>(`${this.api}/asktojoin`, data);
  }

  // 3. Withdraw from auction
  withdrawFromAuction(model: JoinAuctionViewModel): Observable<APIResult<boolean>> {
    return this.http.post<APIResult<boolean>>(`${this.api}/withdraw`, model);
  }

  // 4. Get recycler's requests
  getMyRequests(): Observable<AuctionRecyclingRequestDisplyVM[]> {
    return this.http.get<AuctionRecyclingRequestDisplyVM[]>(`${this.api}/RecyclerRequestes`);
  }

  // 5. Check if joined
  hasJoinedAuction(auctionId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.api}/GetRequestswithauction?auctionid=${auctionId}`);
  }
}
