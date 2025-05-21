import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WishlistItem, WishlistVM } from '../Models/wishlist.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private baseUrl = `${environment.apiUrl}/WishList`;

  constructor(private http: HttpClient) {}

  getWishlist(): Observable<WishlistItem[]> {
    return this.http.post<WishlistItem[]>(`${this.baseUrl}/Index`, {});
  }

  addToWishlist(productId: number): Observable<string> {
    const wishlistData: WishlistVM = { ProductId: productId };
    return this.http.get<string>(`${this.baseUrl}/AddToWishlist`, { params: { productId } });
  }

  deleteProduct(productId: number): Observable<string> {
    const wishlistData: WishlistVM = { ProductId: productId };
    return this.http.delete<string>(`${this.baseUrl}/Delete`, { body: wishlistData });
  }

  clearWishlist(): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/Clear`, {});
  }
}
