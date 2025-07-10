import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface StripeWalletRechargeRequest {
  Amount: number;
  PaymentMethod?: string;
  redirectPath?: string;
}

export interface StripePaymentResponse {
  success: boolean;
  clientSecret?: string;
  paymentUrl?: string;
  message?: string;
  paymentIntentId?: string;
  sessionId?: string;
}

export interface StripeOrderPaymentRequest {
  amount: number;
  orderId: number;
}

@Injectable({
  providedIn: 'root',
})
export class StripePaymentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Wallet Recharge Methods
  createWalletRechargeIntent(
    request: StripeWalletRechargeRequest
  ): Observable<StripePaymentResponse> {
    return this.http
      .post<any>(
        `${this.apiUrl}/Wallet/recharge/create-payment-intent`,
        request
      )
      .pipe(
        map((response: any) => {
          console.log('Backend response for payment intent:', response);
          if (response.IsSuccess && response.Data) {
            return response.Data;
          }
          throw new Error(
            response.Message || 'Failed to create payment intent'
          );
        }),
        catchError(this.handleError)
      );
  }

  createWalletRechargeSession(
    request: StripeWalletRechargeRequest
  ): Observable<StripePaymentResponse> {
    return this.http
      .post<any>(
        `${this.apiUrl}/Wallet/recharge/create-checkout-session`,
        request
      )
      .pipe(
        map((response: any) => {
          console.log('Backend response:', response);
          if (response.IsSuccess && response.Data) {
            return response.Data;
          }
          throw new Error(
            response.Message || 'Failed to create checkout session'
          );
        }),
        catchError(this.handleError)
      );
  }

  confirmWalletRecharge(paymentIntentId: string): Observable<string> {
    return this.http
      .post<any>(
        `${this.apiUrl}/Wallet/recharge/confirm-payment`,
        paymentIntentId
      )
      .pipe(
        map((response: any) => {
          if (response.IsSuccess) {
            return response.Data;
          }
          throw new Error(response.Message || 'Failed to confirm payment');
        }),
        catchError(this.handleError)
      );
  }

  confirmWalletRechargeSession(sessionId: string): Observable<string> {
    return this.http.post<any>(
      `${this.apiUrl}/Wallet/recharge/confirm-session`,
      { sessionId },
      { responseType: 'text' as 'json' }
    );
  }

  // Order Payment Methods
  createOrderPaymentIntent(
    request: StripeOrderPaymentRequest
  ): Observable<StripePaymentResponse> {
    return this.http
      .post<any>(`${this.apiUrl}/payment/create-stripe-payment-intent`, request)
      .pipe(
        map((response: any) => {
          if (response.clientSecret) {
            return {
              success: true,
              clientSecret: response.clientSecret,
              message: 'Payment intent created successfully',
            };
          }
          throw new Error('Failed to create payment intent');
        }),
        catchError(this.handleError)
      );
  }

  // Helper method to redirect to Stripe checkout
  redirectToCheckout(paymentUrl: string): void {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }

  // Helper method to handle payment success
  handlePaymentSuccess(sessionId?: string): Observable<any> {
    if (sessionId) {
      return this.confirmWalletRechargeSession(sessionId);
    }
    return throwError(() => new Error('No session ID provided'));
  }

  private handleError(error: any) {
    console.error('Stripe Payment Error:', error);
    return throwError(() => error);
  }
}
