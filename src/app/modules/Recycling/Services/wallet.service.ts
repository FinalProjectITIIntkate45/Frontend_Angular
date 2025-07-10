import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Wallet } from '../../../core/models/wallet.model';
import { PointVM } from '../../../core/models/point-vm.model';
import { APIResult } from '../Models/api-result';

// Interface to match the API response
interface WalletVM {
  balancePoints: number;
  balancecash: number;
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Get user wallet
  getUserWallet(): Observable<Wallet | null> {
    return this.http
      .get<any>(`${this.baseUrl}/Wallet/GetWallet`)
      .pipe(
        map((response) => {
          // Accept both PascalCase and camelCase for APIResult and WalletVM
          const data = response.data ?? response.Data;
          const success = response.success ?? response.IsSuccess;
          if (success && data) {
            return this.convertWalletVMToWallet(data);
          }
          return null;
        }),
        catchError((error) => {
          console.error('Error fetching wallet:', error);
          throw error;
        })
      );
  }

  // Get complete wallet with breakdown data
  getCompleteWallet(): Observable<Wallet | null> {
    return forkJoin({
      wallet: this.getUserWallet(),
      shopPoints: this.getShopPoints(),
      freePoints: this.getFreePoints(),
      pendingPoints: this.getPendingPoints()
    }).pipe(
      map(({ wallet, shopPoints, freePoints, pendingPoints }) => {
        if (wallet) {
          // Calculate totals from the points arrays
          wallet.totalShopPoints = this.calculateTotalPoints(shopPoints.data || []);
          wallet.totalFreePoints = this.calculateTotalPoints(freePoints.data || []);
          wallet.totalPendingPoints = this.calculateTotalPoints(pendingPoints.data || []);
          wallet.totalAllPoints = wallet.totalShopPoints + wallet.totalFreePoints + wallet.totalPendingPoints;
        }
        return wallet;
      }),
      catchError((error) => {
        console.error('Error fetching complete wallet:', error);
        throw error;
      })
    );
  }

  // Get shop points
  getShopPoints(): Observable<APIResult<PointVM[]>> {
    return this.http.get<APIResult<PointVM[]>>(`${this.baseUrl}/Wallet/ShopPoints`);
  }

  // Get free points
  getFreePoints(): Observable<APIResult<PointVM[]>> {
    return this.http.get<APIResult<PointVM[]>>(`${this.baseUrl}/Wallet/GetFreePoints`);
  }

  // Get pending points
  getPendingPoints(): Observable<APIResult<PointVM[]>> {
    return this.http.get<APIResult<PointVM[]>>(`${this.baseUrl}/Wallet/PendingPoints`);
  }

  // Helper method to convert WalletVM to Wallet
  private convertWalletVMToWallet(walletVM: any): Wallet {
    return {
      id: 0, // This will be set by the backend
      balancePoints: walletVM.balancePoints ?? walletVM.BalancePoints ?? 0,
      balancecash: walletVM.balancecash ?? walletVM.Balancecash ?? walletVM.BalanceCash ?? 0,
      lastUpdated: walletVM.lastUpdated ?? walletVM.LastUpdated ?? '',
      usertId: '', // This will be set by the backend
      totalShopPoints: 0,
      totalFreePoints: 0,
      totalPendingPoints: 0,
      totalAllPoints: 0
    };
  }

  // Helper method to calculate total points from PointVM array
  private calculateTotalPoints(points: PointVM[]): number {
    return points.reduce((total, point) => total + point.points, 0);
  }
} 