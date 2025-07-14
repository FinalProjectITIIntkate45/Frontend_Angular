import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WishlistItem, WishlistVM } from '../Models/wishlist.model';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private baseUrl = `${environment.apiUrl}/WishList`;

  private wishlistCountSubject = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getWishlist(
    page: number = 1,
    pageSize: number = 10
  ): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(
      `${this.baseUrl}/Index?page=${page}&pageSize=${pageSize}`
    );
  }

  refreshWishlistCount() {
    this.getWishlist(1, 1).subscribe({
      next: (items) => this.wishlistCountSubject.next(items.length),
      error: () => this.wishlistCountSubject.next(0),
    });
  }

  addToWishlist(productId: number): Observable<string> {
    const wishlistData: WishlistVM = { ProductId: productId };
    return this.http.post<string>(
      `${this.baseUrl}/AddToWishlist`,
      wishlistData
    );
  }

  deleteProduct(productId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/Delete/${productId}`);
  }

  clearWishlist(): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/Clear`, {});
  }
}
