import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { CheckoutResultVM } from '../Models/CheckoutResultVM';
import { OrderCreateViewModel } from '../Models/OrderCreateViewModel';
import { environment } from '../../../../environments/environment.development';
import { APIResponse } from '../../../core/models/APIResponse';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = `${environment.apiUrl}/Checkout`;

  constructor(private http: HttpClient) {}

  checkoutOrder(model: OrderCreateViewModel): Observable<APIResponse<CheckoutResultVM>> {
  return this.http.post<APIResponse<CheckoutResultVM>>(`${this.baseUrl}/checkout-order`, model);
}

}
