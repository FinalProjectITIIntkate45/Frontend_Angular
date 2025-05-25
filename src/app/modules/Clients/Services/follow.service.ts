import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FollowSellerService {
private apiUrl = `${environment.apiUrl}`+'/followSeller'; 

  constructor(private http: HttpClient) {}

  followShop(clientId: string, shopId: number): Observable<any> {
    return this.http.post(this.apiUrl, { clientId, shopId });
  }

  unfollowShop(clientId: string, shopId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?clientId=${clientId}&shopId=${shopId}`);
  }

  getFollowedShops(clientId: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/${clientId}`);
  }
}
