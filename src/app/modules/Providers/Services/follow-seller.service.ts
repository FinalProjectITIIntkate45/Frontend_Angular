import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FollowedSeller } from '../Models/FollowedSeller.model';
import { APIResponse } from '../../../core/models/APIResponse';
import { environment } from '../../../../environments/environment.development';
import { FollowerViewModel } from '../Models/FollowerViewModel.model';

@Injectable({
  providedIn: 'root',
})
export class FollowSellerService {
  private apiUrl = `${environment.apiUrl}/followSeller`;

  constructor(private http: HttpClient) {}

  getMyFollowers() {
    return this.http.get<APIResponse<FollowerViewModel[]>>(
      `${this.apiUrl}/myfollowers`
    );
  }

  followShop(shopId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { shopId });
  }

  unfollowShop(shopId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?shopId=${shopId}`);
  }
}
