import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { APIResponse } from '../models/APIResponse';
import { environment } from '../../../environments/environment';
import { OrderResponseViewModel } from '../../modules/Clients/Models/OrderResponseViewModel';
import { ProviderOrderViewModel } from '../../modules/Providers/Models/ProviderOrderViewModel';



@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) {}

  // ✅ Get all orders for current logged-in client
  getClientOrders(): Observable<APIResponse<OrderResponseViewModel[]>> {
    return this.http.get<APIResponse<OrderResponseViewModel[]>>(`${this.baseUrl}/client`);
  }

  // ✅ Get all orders for current logged-in provider
  getProviderOrders(): Observable<APIResponse<ProviderOrderViewModel[]>> {
    return this.http.get<APIResponse<ProviderOrderViewModel[]>>(`${this.baseUrl}/provider`);
  }

  // ✅ Get specific order (for either client or provider)
  getOrderById(id: number): Observable<APIResponse<OrderResponseViewModel>> {
    return this.http.get<APIResponse<OrderResponseViewModel>>(`${this.baseUrl}/${id}`);
  }

  // ✅ Confirm a specific order (client or provider)
  confirmOrder(id: number): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.baseUrl}/${id}/confirm`, {});
  }

  // ✅ Update order status (for provider/admin)
  updateOrderStatus(id: number, status: number): Observable<APIResponse<string>> {
    return this.http.patch<APIResponse<string>>(`${this.baseUrl}/${id}/status`, { status });
  }

  // ✅ Delete order (for admin or client)
  deleteOrder(id: number): Observable<APIResponse<string>> {
    return this.http.delete<APIResponse<string>>(`${this.baseUrl}/${id}`);
  }
}
