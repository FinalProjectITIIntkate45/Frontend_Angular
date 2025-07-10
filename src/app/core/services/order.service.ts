import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { APIResponse } from '../models/APIResponse';
import { PaginatedResponse } from '../models/PaginatedResponse';
import { environment } from '../../../environments/environment';
import { OrderUpdateViewModel } from '../../shared/models/OrderUpdateViewModel';
import { OrderResponseViewModel } from '../../modules/Clients/Models/OrderResponseViewModel';
import { OrderItemViewModel } from '../../modules/Clients/Models/OrderItemViewModel';
import { ProviderOrderViewModel } from '../../modules/Providers/Models/ProviderOrderViewModel';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) {}

  // Get all orders for current logged-in client with pagination
  getClientOrders(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<APIResponse<PaginatedResponse<OrderResponseViewModel[]>>> {
    return this.http.get<
      APIResponse<PaginatedResponse<OrderResponseViewModel[]>>
    >(`${this.baseUrl}/client?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  // Get all orders for provider with pagination
  getProviderOrders(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<APIResponse<PaginatedResponse<ProviderOrderViewModel[]>>> {
    return this.http.get<
      APIResponse<PaginatedResponse<ProviderOrderViewModel[]>>
    >(`${this.baseUrl}/provider?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  // Get orders by status with pagination
  getOrdersByStatus(
    status: string, // أو يمكن تستخدم enum أو number حسب تعريفك في الـ API
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<APIResponse<PaginatedResponse<OrderResponseViewModel[]>>> {
    return this.http.get<
      APIResponse<PaginatedResponse<OrderResponseViewModel[]>>
    >(
      `${this.baseUrl}/status/${status}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  // Get specific order details
  getOrderById(id: number): Observable<APIResponse<OrderResponseViewModel>> {
    return this.http.get<APIResponse<OrderResponseViewModel>>(
      `${this.baseUrl}/${id}`
    );
  }

  // Confirm order (POST)
  confirmOrder(id: number): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(
      `${this.baseUrl}/${id}/confirm`,
      {}
    );
  }

  // Mark order as paid (POST)
  markOrderAsPaid(id: number): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(
      `${this.baseUrl}/${id}/paid`,
      {}
    );
  }

  // Update order status (PATCH) - ترسل JSON مع خاصية status
  updateOrderStatus(
    id: number,
    model: OrderUpdateViewModel
  ): Observable<APIResponse<string>> {
    return this.http.patch<APIResponse<string>>(
      `${this.baseUrl}/${id}/status`,
      model
    );
  }

  changeOrderStatus(
    id: number,
    newStatus: string // أو number
  ): Observable<APIResponse<string>> {
    return this.http.patch<APIResponse<string>>(
      `${this.baseUrl}/${id}/change-status?newStatus=${newStatus}`,
      {}
    );
  }

  // Cancel order (POST)
  cancelOrder(id: number): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(
      `${this.baseUrl}/${id}/cancel`,
      {}
    );
  }

  // Delete order (DELETE)
  deleteOrder(id: number): Observable<APIResponse<string>> {
    return this.http.delete<APIResponse<string>>(`${this.baseUrl}/${id}`);
  }

  getOrderByIdProvider(
    orderId: number
  ): Observable<APIResponse<ProviderOrderViewModel>> {
    return this.http.get<APIResponse<ProviderOrderViewModel>>(
      `${this.baseUrl}/details/${orderId}`
    );
  }
}
