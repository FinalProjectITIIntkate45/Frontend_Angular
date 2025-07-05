import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../Models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private apiUrl = 'https://localhost:44399/api/Reviews'; 

  constructor(private http: HttpClient) {}

  getVendorReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/client`);
  }

  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}`);
  }
}
