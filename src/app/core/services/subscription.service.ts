import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseUrl = `${environment.apiUrl}/subscription`;

  constructor(private http: HttpClient) {}

  /**
   * ✅ Get the subscription type of the current user (e.g., Basic, VIP)
   */
  getSubscriptionType(): Observable<string> {
    return this.http.get<{ subscriptionType: string }>(`${this.baseUrl}/type`)
      .pipe(map(res => res.subscriptionType));
  }

  /**
   * ✅ Check if the current user is VIP
   */
  isUserVIP(): Observable<boolean> {
    return this.http.get<{ isVip: boolean }>(`${this.baseUrl}/is-vip`)
      .pipe(map(res => res.isVip));
  }

  /**
   * ✅ (Future) Change subscription type
   */
  updateSubscription(newType: 'Basic' | 'VIP'): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, { type: newType });
  }
}
