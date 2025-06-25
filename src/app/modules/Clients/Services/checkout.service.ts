import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { CheckoutResultVM } from '../Models/CheckoutResultVM';
import { CouponCode } from '../Models/CouponCode';
import { OrderCreateViewModel } from '../Models/OrderCreateViewModel';
import { environment } from '../../../../environments/environment.development';
import { APIResponse } from '../../../core/models/APIResponse';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = `${environment.apiUrl}/Checkout`;

  constructor(private http: HttpClient) {}

  // Endpoint 1: Validate Products
  validateProducts(model: OrderCreateViewModel): Observable<APIResponse<boolean>> {
    return this.http.post<APIResponse<boolean>>(`${this.baseUrl}/validate-products`, model);
  }

  // Endpoint 2: Validate Coupon
  validateCoupon(model: OrderCreateViewModel): Observable<APIResponse<CouponCode>> {

    return this.http.post<APIResponse<CouponCode>>(`${this.baseUrl}/validate-coupon`, model);
  }

  // Endpoint 3: Validate Points
  validatePoints(model: OrderCreateViewModel): Observable<APIResponse<boolean>> {
    return this.http.post<APIResponse<boolean>>(`${this.baseUrl}/validate-points`, model);
  }

  // Endpoint 4: Execute Payment
  executePayment(model: OrderCreateViewModel): Observable<APIResponse<CheckoutResultVM>> {
    return this.http.post<APIResponse<CheckoutResultVM>>(`${this.baseUrl}/execute-payment`, model);
  }

  // Endpoint 5: Calculate Final Price and Earned Points
  calculateFinalPriceAndPoints(model: OrderCreateViewModel): Observable<APIResponse<{ FinalPrice: number, EarnedPoints: number }>> {
    return this.http.post<APIResponse<{ FinalPrice: number, EarnedPoints: number }>>(`${this.baseUrl}/calculate-price`, model);
  }

  // Endpoint 6: Deduct Points
  deductPoints(model: OrderCreateViewModel): Observable<APIResponse<{ Message: string }>> {
    return this.http.post<APIResponse<{ Message: string }>>(`${this.baseUrl}/deduct-points`, model);
  }

  // Endpoint 7: Create Order
  createOrder(model: OrderCreateViewModel): Observable<APIResponse<{ Order: any }>> {
    return this.http.post<APIResponse<{ Order: any }>>(`${this.baseUrl}/create-order`, model);
  }

  // Endpoint 8: Finalize Checkout
  finalizeCheckout(model: OrderCreateViewModel): Observable<APIResponse<CheckoutResultVM>> {
    return this.http.post<APIResponse<CheckoutResultVM>>(`${this.baseUrl}/finalize-checkout`, model);
  }
}
