import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewView } from '../models/ReviewView.Models';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GeneralreviewsService {
  private baseUrl = `${environment.apiUrl}/Reviews`;

  constructor(private http: HttpClient) {}

  // ✅ GET: api/Reviews/product/{productId}
  getReviewsByProduct(productId: number): Observable<ReviewView[]> {
    return this.http.get<ReviewView[]>(`${this.baseUrl}/product/${productId}`);
  }

  // ✅ GET: api/Reviews/client
  getReviewsByClient(): Observable<ReviewView[]> {
    return this.http.get<ReviewView[]>(`${this.baseUrl}/client`);
  }

  // ✅ GET: api/Reviews/order/{orderId}
  getReviewsByOrder(orderId: number): Observable<ReviewView[]> {
    return this.http.get<ReviewView[]>(`${this.baseUrl}/order/${orderId}`);
  }

  // ✅ GET: api/Reviews/{id}
  getReviewById(id: number): Observable<ReviewView> {
    return this.http.get<ReviewView>(`${this.baseUrl}/${id}`);
  }

  // ✅ POST: api/Reviews
  createReview(review: ReviewView): Observable<ReviewView> {
    return this.http.post<ReviewView>(this.baseUrl, review);
  }

  // ✅ PUT: api/Reviews/{id}
  updateReview(id: number, review: ReviewView): Observable<ReviewView> {
    return this.http.put<ReviewView>(`${this.baseUrl}/${id}`, review);
  }

  // ✅ DELETE: api/Reviews/{id}
  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
