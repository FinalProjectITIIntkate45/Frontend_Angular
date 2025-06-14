import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { CheckoutResultVM } from '../Models/CheckoutResultVM';
import { OrderCreateViewModel } from '../Models/OrderCreateViewModel';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = `${environment.apiUrl}/Checkout`;

  constructor(private http: HttpClient) {}

  checkoutOrder(model: OrderCreateViewModel): Observable<CheckoutResultVM> {
    return this.http.post<CheckoutResultVM>(`${this.baseUrl}/checkout-order`, model);
  }
}
