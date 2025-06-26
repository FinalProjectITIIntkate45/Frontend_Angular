import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  // Used for handling asynchronous operations
import { CartItemInterface } from '../Models/CartItemInterface';
import { environment } from '../../../../environments/environment.development';
import { CartInterface } from '../Models/CartInterface';

@Injectable({
  providedIn: 'root'
})
export class CartServicesService {

private baseUrl = `${environment.apiUrl}`+`/cart`;

  constructor(private http: HttpClient) { }

  // ✅ Add item to cart (clientId مستخرج في الباك إند من التوكن)
  addToCart(productId: number, quantity: number, price: number, points: number): Observable<any> {
    const params = `?productId=${productId}&quantity=${quantity}&price=${price}&points=${points}`;
    return this.http.post(`${this.baseUrl}/add${params}`, null);
  }

  // ✅ Get cart items (for current authenticated user)
  getCartItems(): Observable<CartInterface> {
    return this.http.get<CartInterface>(`${this.baseUrl}/CartlistAllItems`);
  }

  // ✅ Remove item by ID
  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${cartItemId}`);
  }


  // ✅ Get cart list details (for current user)
  getCartListDetails(): Observable<CartInterface> {
    return this.http.get<CartInterface>(`${this.baseUrl}/CartlistAllItems`);
  }

  // Add offer to cart (with offerId)
  addOfferToCart(productId: number, quantity: number, price: number, points: number, offerId: number): Observable<any> {
    const params = `?productId=${productId}&quantity=${quantity}&price=${price}&points=${points}&offerId=${offerId}`;
    return this.http.post(`${this.baseUrl}/add${params}`, null);
  }

  clearCart(): Observable<any> {
  return this.http.delete(`${this.baseUrl}/clear`);
}

}
