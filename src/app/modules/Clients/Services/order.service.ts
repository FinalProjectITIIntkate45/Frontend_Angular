import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { OrderResponseViewModel } from '../Models/OrderResponseViewModel';
import { environment } from '../../../../environments/environment.development';
import { APIResponse } from '../../../core/models/APIResponse';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) {}

  // ✅ Get order by ID
  getOrderById(id: number): Observable<APIResponse<OrderResponseViewModel>> {
    return this.http.get<APIResponse<OrderResponseViewModel>>(`${this.baseUrl}/${id}`);
  }

  // ✅ Get all orders for a specific client
  getClientOrders(clientId: string): Observable<APIResponse<OrderResponseViewModel[]>> {
    return this.http.get<APIResponse<OrderResponseViewModel[]>>(`${this.baseUrl}/client/${clientId}`);
  }

  // ✅ Confirm an order
  confirmOrder(id: number): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(`${this.baseUrl}/${id}/confirm`, {});
  }

  // ✅ Update order status
  updateOrderStatus(id: number, newStatus: number): Observable<APIResponse<string>> {
    return this.http.patch<APIResponse<string>>(`${this.baseUrl}/${id}/status`, { status: newStatus });
  }

  // ✅ Delete order
  deleteOrder(id: number): Observable<APIResponse<string>> {
    return this.http.delete<APIResponse<string>>(`${this.baseUrl}/${id}`);
  }
}
