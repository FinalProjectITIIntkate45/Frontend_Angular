import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { SubscriptionChangeRequest } from '../Models/SubscriptionChangeRequest';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseUrl = `${environment.apiUrl}/subscription`; 
  constructor(private http: HttpClient) {}

  changeSubscription(request: SubscriptionChangeRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/change`, request);
  }
}
