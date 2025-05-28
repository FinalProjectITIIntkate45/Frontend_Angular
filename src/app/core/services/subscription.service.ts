import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private baseUrl = `${environment.apiUrl}/subscription`;

  constructor(private http: HttpClient) {}

  /**
   * ✅ Get the current user's subscription type (e.g., "Basic", "VIP")
   */
  getSubscriptionType(): Observable<'Basic' | 'VIP'> {
    return this.http
      .get<{ subscriptionType: 'Basic' | 'VIP' }>(`${this.baseUrl}/type`)
      .pipe(map((res) => res.subscriptionType));
  }

  /**
   * ✅ Check if the user has a VIP subscription
   */
  isUserVIP(): Observable<boolean> {
    return this.http
      .get<{ isVip: boolean }>(`${this.baseUrl}/is-vip`)
      .pipe(map((res) => res.isVip));
  }

  /**
   * 🔁 Change the user's subscription type
   */
  updateSubscription(newType: 'Basic' | 'VIP'): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, { type: newType });
  }
}
