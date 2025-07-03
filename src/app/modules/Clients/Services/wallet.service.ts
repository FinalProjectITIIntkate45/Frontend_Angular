import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ShopPoint, FreePoint, WalletView } from '../Models/wallet.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = environment.apiUrl + '/Wallet';

  constructor(private http: HttpClient) {}

  getWalletView(userId: string): Observable<WalletView> {
    return this.http
      .get<WalletView>(`${this.apiUrl}/${userId}`)
      .pipe(catchError(this.handleError));
  }

  getShopPoints(userId: string): Observable<ShopPoint[]> {
    return this.http
      .get<ShopPoint[]>(`${this.apiUrl}/${userId}/shop-points`)
      .pipe(catchError(this.handleError));
  }

  getFreePoints(userId: string): Observable<FreePoint[]> {
    return this.http
      .get<FreePoint[]>(`${this.apiUrl}/${userId}/free-points`)
      .pipe(catchError(this.handleError));
  }

  getPendingPoints(userId: string): Observable<FreePoint[]> {
    return this.http
      .get<FreePoint[]>(`${this.apiUrl}/${userId}/pending-points`)
      .pipe(catchError(this.handleError));
  }

  createWallet(userId: string): Observable<WalletView> {
    return this.http
      .post<WalletView>(`${this.apiUrl}`, { userId })
      .pipe(catchError(this.handleError));
  }

  updatePoints(userId: string, amount: number): Observable<WalletView> {
    return this.http
      .put<WalletView>(`${this.apiUrl}/${userId}/points`, amount)
      .pipe(catchError(this.handleError));
  }

  updateCashBalance(amount: number): Observable<string> {
    return this.http
      .put<string>(`${this.apiUrl}/UpdateWalletCashBalance`, amount)
      .pipe(catchError(this.handleError));
  }

  deleteWallet(): Observable<string> {
    return this.http
      .delete<string>(`${this.apiUrl}/DeleteWallet`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    return throwError(() => error);
  }
}
