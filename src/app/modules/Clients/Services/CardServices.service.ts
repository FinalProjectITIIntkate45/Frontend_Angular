import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Used for handling asynchronous operations
import { CartItemInterface } from '../Models/CartItemInterface';
import { environment } from '../../../../environments/environment.development';
import { CartInterface } from '../Models/CartInterface';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartServicesService {
  private baseUrl = `${environment.apiUrl}` + `/cart`;

  // BehaviorSubject to hold the cart item count
  private cartItemsCountSubject = new BehaviorSubject<number>(0);
  cartItemsCount$ = this.cartItemsCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshCartItemsCount(); // Initialize count on service creation
  }

  // Call this to refresh the cart item count from backend
  refreshCartItemsCount() {
    this.getCartItems().subscribe((cart) => {
      this.cartItemsCountSubject.next(cart?.Items?.length || 0);
    });
  }

  // ✅ Add item to cart (clientId مستخرج في الباك إند من التوكن)
  addToCart(
    productId: number,
    quantity: number,
    price: number,
    points: number
  ): Observable<any> {
    const params = `?productId=${productId}&quantity=${quantity}&price=${price}&points=${points}`;
    return this.http.post(`${this.baseUrl}/add${params}`, null).pipe(
      // Update count after adding
      // Use tap to perform side effect
      tap(() => this.refreshCartItemsCount())
    );
  }

  // ✅ Get cart items (for current authenticated user)
  getCartItems(): Observable<CartInterface> {
    return this.http.get<CartInterface>(`${this.baseUrl}/CartlistAllItems`);
  }

  // ✅ Remove item by ID
  removeFromCart(cartItemId: number): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/remove/${cartItemId}`)
      .pipe(tap(() => this.refreshCartItemsCount()));
  }

  // ✅ Get cart list details (for current user)
  getCartListDetails(): Observable<CartInterface> {
    return this.http.get<CartInterface>(`${this.baseUrl}/CartlistAllItems`);
  }

  // Add offer to cart (with offerId)
  addOfferToCart(
    productId: number,
    quantity: number,
    price: number,
    points: number,
    offerId: number
  ): Observable<any> {
    const params = `?productId=${productId}&quantity=${quantity}&price=${price}&points=${points}&offerId=${offerId}`;
    return this.http.post(`${this.baseUrl}/add${params}`, null);
  }

  clearCart(): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/clear`)
      .pipe(tap(() => this.refreshCartItemsCount()));
  }
}
