import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { APIResponse } from '../../../core/models/APIResponse';
import { ShopViewModel } from '../Models/shop-view-model';

// Interface to match the backend response
interface FollowedSellerViewModel {
  ClientId: string;
  ShopId: number;
  ShopName: string;
}

@Injectable({
  providedIn: 'root',
})
export class FollowSellerService {
  private apiUrl = `${environment.apiUrl}` + '/followSeller';

  constructor(private http: HttpClient) {}

  followShop(shopId: number): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(this.apiUrl, { shopId });
  }

  unfollowShop(shopId: number): Observable<APIResponse<string>> {
    return this.http.delete<APIResponse<string>>(
      `${this.apiUrl}?shopId=${shopId}`
    );
  }

  getFollowedShops(): Observable<APIResponse<number[]>> {
    return this.http
      .get<APIResponse<FollowedSellerViewModel[]>>(`${this.apiUrl}`)
      .pipe(
        map((response) => ({
          ...response,
          Data: response.Data.map((item) => item.ShopId),
        }))
      );
  }

  getAllShops() {
    return this.http.get<APIResponse<ShopViewModel[]>>(
      `${environment.apiUrl}/Shop/all`
    );
  }
}
