import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { APIResponse } from '../models/APIResponse';
import { Point } from '../models/point.model';
import { Wallet } from '../models/wallet.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private baseUrl = `${environment.apiUrl}/wallet`;

  constructor(private http: HttpClient) {}

  // 🔹 Get Wallet by userId (مازال يتطلب userId حسب الـ controller الحالي)
  getWallet(): Observable<Wallet> {
    return this.http.get<APIResponse<Wallet>>(`${this.baseUrl}/GetWallet`)
      .pipe(map(res => res.Data));
  }

  // 🔹 Create wallet (مازال يتطلب userId في الـ body)
  createWallet(userId: string): Observable<Wallet> {
    return this.http.post<APIResponse<Wallet>>(this.baseUrl, { userId })
      .pipe(map(res => res.Data));
  }

  // 🔹 Update wallet points (يتطلب userId في الـ URL)
  updatePoints(userId: string, amount: number): Observable<Wallet> {
    return this.http.put<APIResponse<Wallet>>(`${this.baseUrl}/${userId}/points`, amount)
      .pipe(map(res => res.Data));
  }

  // 🔹 Update wallet cash (لا يحتاج userId، يتم استخدام Claims)
  updateCash(amount: number): Observable<void> {
    return this.http
      .put<APIResponse<string>>(`${this.baseUrl}/UpdateWalletCashBalance`, amount)
      .pipe(map(() => {}));
  }

  // 🔹 Delete wallet (يتم تحديد المستخدم من Claims)
  deleteWallet(): Observable<void> {
    return this.http
      .delete<APIResponse<string>>(`${this.baseUrl}/DeleteWallet`)
      .pipe(map(() => {}));
  }

  // 🔹 Get all ShopPoints (لا يحتاج userId)
  getShopPoints(): Observable<Point[]> {
    return this.http
      .get<APIResponse<Point[]>>(`${this.baseUrl}/GetShopPoints`)
      .pipe(map(res => res.Data));
  }

  // 🔹 Get all FreePoints (لا يحتاج userId)
  getFreePoints(): Observable<Point[]> {
    return this.http
      .get<APIResponse<Point[]>>(`${this.baseUrl}/GetFreePoints`)
      .pipe(map(res => res.Data));
  }

  // 🔹 Get all PendingPoints (لا يحتاج userId)
  getPendingPoints(): Observable<Point[]> {
    return this.http
      .get<APIResponse<Point[]>>(`${this.baseUrl}/GetPendingPoints`)
      .pipe(map(res => res.Data));
  }

  // ✅ Optional: Unified method to get any type of points (if you prefer dynamic handling)
  getPoints(type: 'GetShopPoints' | 'GetFreePoints' | 'GetPendingPoints'): Observable<Point[]> {
    return this.http
      .get<APIResponse<Point[]>>(`${this.baseUrl}/${type}`)
      .pipe(map(res => res.Data));
  }

  // 🔹 Get total points (اعتمادًا على getWallet)
  getTotalPoints(): Observable<number> {
    return this.getWallet().pipe(map(w => w.totalAllPoints));
  }
}
