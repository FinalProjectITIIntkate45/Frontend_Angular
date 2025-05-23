import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseUrl = 'http://localhost:5000/api/provider'; 

  constructor(private http: HttpClient) {}

  updateSubscription(userId: string, type: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/update-subscription`, {
      userId,
      type
    });
  }
}
