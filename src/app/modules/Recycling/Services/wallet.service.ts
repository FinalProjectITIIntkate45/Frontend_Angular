import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = environment.apiUrl + '/Wallet';

  constructor(private http: HttpClient) {}

  // Get simplified wallet summary with three cards
  getWalletSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/wallet`).pipe(
      map((response: any) => {
        // Handle case where response is the wallet data directly
        if (
          response &&
          typeof response === 'object' &&
          !response.isSuccess &&
          !response.IsSuccess
        ) {
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
          const wallet = response.data || response.Data;
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

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => error);
  }
} 