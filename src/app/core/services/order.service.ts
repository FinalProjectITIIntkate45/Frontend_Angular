import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { APIResponse } from '../models/APIResponse';
import { environment } from '../../../environments/environment';
import { OrderResponseViewModel } from '../../modules/Clients/Models/OrderResponseViewModel';
import { OrderItemViewModel } from '../../modules/Clients/Models/OrderItemViewModel';
import { ProviderOrderViewModel } from '../../modules/Providers/Models/ProviderOrderViewModel';

// Backend response interfaces (PascalCase)
interface BackendOrderResponseViewModel {
  Id: number;
  ClientId: string;
  DateCreated: string;
  TotalPrice: number;
  Status: any;
  IsPaid: boolean;
  PaymentType: any;
  UsedPaidPoints: number;
  UsedFreePoints: number;
  EarnedPoints: number;
  Items: BackendOrderItemResponseViewModel[];
}

interface BackendOrderItemResponseViewModel {
  ProductId: number;
  Quantity: number;
  Price?: number;
  Name?: string;
  ShopName?: string;
  Description?: string;
  PriceAfterDiscount?: number;
  Image?: string;
  Points?: number;
  ProductName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) {}

  // Helper method to map backend response to frontend model
  private mapBackendToFrontendOrder(
    backendOrder: BackendOrderResponseViewModel
  ): OrderResponseViewModel {
    return {
      id: backendOrder.Id,
      clientId: backendOrder.ClientId,
      dateCreated: backendOrder.DateCreated,
      totalPrice: backendOrder.TotalPrice,
      status: backendOrder.Status,
      isPaid: backendOrder.IsPaid,
      paymentType: backendOrder.PaymentType,
      usedPaidPoints: backendOrder.UsedPaidPoints,
      usedFreePoints: backendOrder.UsedFreePoints,
      earnedPoints: backendOrder.EarnedPoints,
      items:
        backendOrder.Items?.map((item) =>
          this.mapBackendToFrontendOrderItem(item)
        ) || [],
    };
  }

  private mapBackendToFrontendOrderItem(
    backendItem: BackendOrderItemResponseViewModel
  ): OrderItemViewModel {
    return {
      productId: backendItem.ProductId,
      quantity: backendItem.Quantity,
      price: backendItem.Price,
      name: backendItem.Name,
      shopName: backendItem.ShopName,
      description: backendItem.Description,
      priceAfterDiscount: backendItem.PriceAfterDiscount,
      image: backendItem.Image,
      points: backendItem.Points,
      productName: backendItem.ProductName,
    };
  }

  // ✅ Get all orders for current logged-in client
  getClientOrders(): Observable<APIResponse<OrderResponseViewModel[]>> {
    return this.http
      .get<APIResponse<BackendOrderResponseViewModel[]>>(
        `${this.baseUrl}/client`
      )
      .pipe(
        map((response) => ({
          ...response,
          Data:
            response.Data?.map((order) =>
              this.mapBackendToFrontendOrder(order)
            ) || [],
        }))
      );
  }

  // ✅ Get all orders for current logged-in provider
  getProviderOrders(): Observable<APIResponse<ProviderOrderViewModel[]>> {
    return this.http.get<APIResponse<ProviderOrderViewModel[]>>(
      `${this.baseUrl}/provider`
    );
  }

  // ✅ Get specific order (for either client or provider)
  getOrderById(id: number): Observable<APIResponse<OrderResponseViewModel>> {
    return this.http
      .get<APIResponse<BackendOrderResponseViewModel>>(`${this.baseUrl}/${id}`)
      .pipe(
        map((response) => ({
          ...response,
          Data: response.Data
            ? this.mapBackendToFrontendOrder(response.Data)
            : ({} as OrderResponseViewModel),
        }))
      );
  }

  // ✅ Confirm a specific order (client or provider)
  confirmOrder(id: number): Observable<APIResponse<string>> {
    return this.http.post<APIResponse<string>>(
      `${this.baseUrl}/${id}/confirm`,
      {}
    );
  }

  // ✅ Update order status (for provider/admin)
  updateOrderStatus(
    id: number,
    status: number | string
  ): Observable<APIResponse<string>> {
    return this.http.patch<APIResponse<string>>(
      `${this.baseUrl}/${id}/status`,
      { status }
    );
  }

  // ✅ Delete order (for admin or client)
  deleteOrder(id: number): Observable<APIResponse<string>> {
    return this.http.delete<APIResponse<string>>(`${this.baseUrl}/${id}`);
  }
}
