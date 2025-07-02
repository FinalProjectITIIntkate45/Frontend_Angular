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

  // 🔹 Get Wallet by userId
  getWallet(userId: string): Observable<Wallet> {
  return this.http.get<APIResponse<Wallet>>(`${this.baseUrl}/${userId}`)
    .pipe(
      map(res => {
        const w = res.Data;
        return {
          ...w,
          totalShopPoints: w.totalShopPoints ?? w.totalShopPoints,
          totalFreePoints: w.totalFreePoints ?? w.totalFreePoints,
          totalPendingPoints: w.totalPendingPoints ?? w.totalPendingPoints,
          totalAllPoints: w.totalAllPoints ?? w.totalAllPoints
        };
      })
    );
}


  // 🔹 Create wallet
  createWallet(userId: string): Observable<Wallet> {
    return this.http.post<APIResponse<Wallet>>(this.baseUrl, { userId })
      .pipe(map(res => res.Data));
  }

  // 🔹 Update wallet points
  updatePoints(userId: string, amount: number): Observable<Wallet> {
    return this.http.put<APIResponse<Wallet>>(`${this.baseUrl}/${userId}/points`, amount)
      .pipe(map(res => res.Data));
  }

  // 🔹 Update wallet cash
  updateCash(userId: string, amount: number): Observable<Wallet> {
    return this.http.put<APIResponse<Wallet>>(`${this.baseUrl}/${userId}/cash`, amount)
      .pipe(map(res => res.Data));
  }

  // 🔹 Delete wallet
  deleteWallet(userId: string): Observable<void> {
    return this.http.delete<APIResponse<string>>(`${this.baseUrl}/${userId}`)
      .pipe(map(() => {})); // return void
  }
  // 🔹 Get wallet balance

  getTotalPoints(userId: string): Observable<number> {
  return this.getWallet(userId).pipe(map(w => w.totalAllPoints));
}
// 🔹 Get all ShopPoints
getShopPoints(userId: string): Observable<Point[]> {
  return this.http.get<APIResponse<Point[]>>(`${this.baseUrl}/${userId}/shop-points`)
    .pipe(map(res => res.Data));
}

// 🔹 Get all FreePoints
getFreePoints(userId: string): Observable<Point[]> {
  return this.http.get<APIResponse<Point[]>>(`${this.baseUrl}/${userId}/free-points`)
    .pipe(map(res => res.Data));
}

// 🔹 Get all PendingPoints
getPendingPoints(userId: string): Observable<Point[]> {
  return this.http.get<APIResponse<Point[]>>(`${this.baseUrl}/${userId}/pending-points`)
    .pipe(map(res => res.Data));
}




}
