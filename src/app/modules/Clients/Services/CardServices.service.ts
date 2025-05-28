import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  // Used for handling asynchronous operations
import { CartItemInterface } from '../models/CartItemInterface';

@Injectable({
  providedIn: 'root'
})
export class CartServicesService {  // Renamed from CardServicesService
  
  private readonly baseUrl = 'https://localhost:7109/api/cart';

  constructor(private http: HttpClient) { }

  // Add item to cart
  addToCart(item: Partial<CartItemInterface>): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, item);  // Removed trailing slash
  }

  // Get cart items for a specific client
  getCartItems(clientId: string): Observable<CartItemInterface[]> {
    return this.http.get<CartItemInterface[]>(`${this.baseUrl}/list?clientId=${clientId}`);  // Fixed query parameter
  }

  // Remove specific item from cart
  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${cartItemId}`);
  }

  // Clear entire cart for a client
  clearCart(clientId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clear?clientId=${clientId}`);
  }

  // Update item quantity (additional method you might need)
  updateCartItemQuantity(cartItemId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${cartItemId}`, { quantity });
  }
}