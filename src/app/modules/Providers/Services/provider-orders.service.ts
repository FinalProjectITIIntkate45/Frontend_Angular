import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProviderOrder } from '../Models/provider-orders.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderOrdersService {
  private apiUrl = 'api/orders/provider';

  constructor(private http: HttpClient) {}

  getProviderOrders(providerId: string): Observable<ProviderOrder[]> {
    return this.http.get<ProviderOrder[]>(`${this.apiUrl}/${providerId}`);
  }
}