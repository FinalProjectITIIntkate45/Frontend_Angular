import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FollowedSeller } from '../Models/FollowedSeller.model';

@Injectable({
  providedIn: 'root'
})
export class FollowSellerService {
  private apiUrl = 'https://localhost:port/api/followedshops'; 

  constructor(private http: HttpClient) {}

  getFollowersForVendor(clientId: string): Observable<FollowedSeller[]> {
    return this.http.get<FollowedSeller[]>(`${this.apiUrl}/${clientId}`);
  }
}
