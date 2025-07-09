import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProviderOrder, OrderStatus } from '../Models/provider-orders.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProviderOrdersService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getProviderOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/provider`);
  }

  updateOrderStatus(orderId: number, status: OrderStatus): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${orderId}/status`, { status });
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${orderId}`);
  }
}
