import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Wallet } from '../Models/wallet.model';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Get user wallet
  getUserWallet(): Observable<Wallet | null> {
    return this.http
      .get<Wallet>(`${this.baseUrl}/Wallet/getWallet`)
      .pipe(
        map((response) => {
          console.log('Wallet response:', response);
          return response || null;
        }),
        catchError((error) => {
          console.error('Error fetching wallet:', error);
          throw error;
        })
      );
  }
} 