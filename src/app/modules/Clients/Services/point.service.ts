import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { WalletSummary, BasicWallet } from '../Models/wallet.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PointService {
  private apiUrl = environment.apiUrl + '/Wallet';

  constructor(private http: HttpClient) {}

  // Get simplified wallet summary with three cards
  getWalletSummary(): Observable<WalletSummary> {
    return this.http.get<any>(`${this.apiUrl}/user/wallet`).pipe(
      map((response: any) => {
        console.log('Raw API response:', response);

        // Handle case where response is the wallet data directly
        if (
          response &&
          typeof response === 'object' &&
          !response.isSuccess &&
          !response.IsSuccess
        ) {
          console.log('Direct wallet response detected');
          return {
            balancePoints:
              response.BalancePoints || response.balancePoints || 0,
            balanceCash: response.BalanceCash || response.balanceCash || 0,
            lastUpdated:
              response.LastUpdated ||
              response.lastUpdated ||
              new Date().toISOString(),
            freePoints: { totalPoints: 0, totalCount: 0, recentPoints: [] },
            shopPoints: { totalPoints: 0, totalCount: 0, recentPoints: [] },
            pendingPoints: { totalPoints: 0, totalCount: 0, recentPoints: [] },
          };
        }

        // Handle APIResult response structure
        if (
          (response.isSuccess || response.IsSuccess) &&
          (response.data || response.Data)
        ) {
          const wallet: BasicWallet = response.data || response.Data;
          console.log('Wallet data:', wallet);
          return {
            balancePoints: wallet.BalancePoints || 0,
            balanceCash: wallet.BalanceCash || 0,
            lastUpdated: wallet.LastUpdated || new Date().toISOString(),
            freePoints: { totalPoints: 0, totalCount: 0, recentPoints: [] },
            shopPoints: { totalPoints: 0, totalCount: 0, recentPoints: [] },
            pendingPoints: { totalPoints: 0, totalCount: 0, recentPoints: [] },
          };
        }

        // If no valid response structure, return default wallet
        console.log('No valid wallet data found, returning default');
        return {
          balancePoints: 0,
          balanceCash: 0,
          lastUpdated: new Date().toISOString(),
          freePoints: { totalPoints: 0, totalCount: 0, recentPoints: [] },
          shopPoints: { totalPoints: 0, totalCount: 0, recentPoints: [] },
          pendingPoints: { totalPoints: 0, totalCount: 0, recentPoints: [] },
        };
      }),
      catchError(this.handleError)
    );
  }

  // Get shop points summary
  getShopPointsSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetShopPoints`).pipe(
      map((response: any) => {
        console.log('Shop points raw response:', response);

        // Handle direct response
        if (response && Array.isArray(response)) {
          return response;
        }

        // Handle APIResult response
        if (
          (response.isSuccess || response.IsSuccess) &&
          (response.data || response.Data)
        ) {
          return response.data || response.Data;
        }

        // Return empty array if no valid data
        console.log('No valid shop points data, returning empty array');
        return [];
      }),
      catchError(this.handleError)
    );
  }

  // Get free points summary
  getFreePointsSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetFreePoints`).pipe(
      map((response: any) => {
        console.log('Free points raw response:', response);

        // Handle direct response
        if (response && Array.isArray(response)) {
          return response;
        }

        // Handle APIResult response
        if (
          (response.isSuccess || response.IsSuccess) &&
          (response.data || response.Data)
        ) {
          return response.data || response.Data;
        }

        // Return empty array if no valid data
        console.log('No valid free points data, returning empty array');
        return [];
      }),
      catchError(this.handleError)
    );
  }

  // Get pending points summary
  getPendingPointsSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetPendingPoints`).pipe(
      map((response: any) => {
        console.log('Pending points raw response:', response);

        // Handle direct response
        if (response && Array.isArray(response)) {
          return response;
        }

        // Handle APIResult response
        if (
          (response.isSuccess || response.IsSuccess) &&
          (response.data || response.Data)
        ) {
          return response.data || response.Data;
        }

        // Return empty array if no valid data
        console.log('No valid pending points data, returning empty array');
        return [];
      }),
      catchError(this.handleError)
    );
  }

  // Legacy methods for backward compatibility
  getWalletView(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/user/wallet`)
      .pipe(catchError(this.handleError));
  }

  getShopPoints(userId: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/user`)
      .pipe(catchError(this.handleError));
  }

  getFreePoints(userId: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/free-points`)
      .pipe(catchError(this.handleError));
  }

  getPendingPoints(userId: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/pending-points`)
      .pipe(catchError(this.handleError));
  }

  createWallet(userId: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}`, { userId })
      .pipe(catchError(this.handleError));
  }

  updatePoints(userId: string, amount: number): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/points`, amount)
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
    console.error('API Error:', error);
    return throwError(() => error);
  }
}
