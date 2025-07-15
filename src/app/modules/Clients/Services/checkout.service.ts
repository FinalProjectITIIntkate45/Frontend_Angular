import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CheckoutResultVM } from '../Models/CheckoutResultVM';
import { ConfirmPaymentVM } from '../Models/ConfirmPaymentVM';
import { CouponCode } from '../Models/CouponCode';
import { OrderCreateViewModel } from '../Models/OrderCreateViewModel';
import { environment } from '../../../../environments/environment.development';
import { APIResponse } from '../../../core/models/APIResponse';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private baseUrl = `${environment.apiUrl}/Checkout`;

  constructor(private http: HttpClient) {}

  // Endpoint 1: Validate Products
  validateProducts(
    model: OrderCreateViewModel
  ): Observable<APIResponse<boolean>> {
    const backendModel = this.mapToBackendModel(model);
    return this.http.post<APIResponse<boolean>>(
      `${this.baseUrl}/validate-products`,
      backendModel
    );
  }

  // Endpoint 2: Validate Coupon
  validateCoupon(
    model: OrderCreateViewModel
  ): Observable<APIResponse<CouponCode>> {
    const backendModel = this.mapToBackendModel(model);
    return this.http.post<APIResponse<CouponCode>>(
      `${this.baseUrl}/validate-coupon`,
      backendModel
    );
  }

  // Endpoint 3: Validate Points
  validatePoints(
    model: OrderCreateViewModel
  ): Observable<APIResponse<boolean>> {
    const backendModel = this.mapToBackendModel(model);
    return this.http.post<APIResponse<boolean>>(
      `${this.baseUrl}/validate-points`,
      backendModel
    );
  }

  // Endpoint 4: Execute Payment
  executePayment(
    model: OrderCreateViewModel
  ): Observable<APIResponse<CheckoutResultVM>> {
    const backendModel = this.mapToBackendModel(model);
    return this.http.post<APIResponse<CheckoutResultVM>>(
      `${this.baseUrl}/execute-payment`,
      backendModel
    );
  }

  // Endpoint 5: Calculate Final Price and Earned Points
  calculateFinalPriceAndPoints(
    model: OrderCreateViewModel
  ): Observable<APIResponse<{ FinalPrice: number; EarnedPoints: number }>> {
    const backendModel = this.mapToBackendModel(model);
    return this.http.post<
      APIResponse<{ FinalPrice: number; EarnedPoints: number }>
    >(`${this.baseUrl}/calculate-price`, backendModel);
  }

  // Endpoint 6: Deduct Points
  deductPoints(
    model: OrderCreateViewModel
  ): Observable<APIResponse<{ Message: string }>> {
    const backendModel = this.mapToBackendModel(model);
    return this.http.post<APIResponse<{ Message: string }>>(
      `${this.baseUrl}/deduct-points`,
      backendModel
    );
  }

  // Endpoint 7: Create Order
  createOrder(
    model: OrderCreateViewModel
  ): Observable<APIResponse<{ Order: any }>> {
    const backendModel = this.mapToBackendModel(model);
    return this.http.post<APIResponse<{ Order: any }>>(
      `${this.baseUrl}/create-order`,
      backendModel
    );
  }

  // Endpoint 8: Finalize Checkout
  finalizeCheckout(
    model: OrderCreateViewModel
  ): Observable<APIResponse<CheckoutResultVM>> {
    const backendModel = this.mapToBackendModel(model);
    return this.http.post<APIResponse<CheckoutResultVM>>(
      `${this.baseUrl}/finalize-checkout`,
      backendModel
    );
  }
  completeOrder(data: { order: OrderCreateViewModel; saveOrder: boolean }) {
    const backendData = {
      order: this.mapToBackendModel(data.order),
      saveOrder: data.saveOrder,
    };
    return this.http.post<APIResponse<CheckoutResultVM>>(
      `${this.baseUrl}/complete-order`,
      backendData
    );
  }
  confirmPayment(data: ConfirmPaymentVM): Observable<ConfirmPaymentVM> {
    return this.http.post<ConfirmPaymentVM>(
      `${this.baseUrl}/ConfirmPayment`,
      data
    );
  }

  private mapToBackendModel(model: OrderCreateViewModel): any {
    return {
      ClientId: model.clientId,
      OrderItems: model.orderItems,
      TotalPrice: model.totalPrice,
      TotalPoints: model.totalPoints,
      UsedPaidPoints: model.usedPaidPoints,
      UsedFreePoints: model.usedFreePoints,
      CouponCode: model.couponCode,
      PaymentType: model.paymentType,
      BillingData: model.billingData
        ? {
            FirstName: model.billingData.firstName,
            LastName: model.billingData.lastName,
            Email: model.billingData.email,
            PhoneNumber: model.billingData.phoneNumber,
            City: model.billingData.city,
            Country: model.billingData.country,
            State: model.billingData.state,
            Apartment: model.billingData.apartment,
            Floor: model.billingData.floor,
            Street: model.billingData.street,
            Building: model.billingData.building,
            ShippingMethod: model.billingData.shippingMethod,
          }
        : null,
      Status: model.status,
    };
  }
}
