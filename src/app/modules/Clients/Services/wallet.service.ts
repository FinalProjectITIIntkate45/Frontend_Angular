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
  private apiUrl = environment.apiUrl + '/ShopPoint';

  constructor(private http: HttpClient) {}

  getWalletView(userId: string): Observable<WalletView> {
    return this.http
      .get<WalletView>(`${this.apiUrl}/user/${userId}/wallet`)
      .pipe(catchError(this.handleError));
  }

  getShopPoints(userId: string): Observable<ShopPoint[]> {
    return this.http
      .get<ShopPoint[]>(`${this.apiUrl}/user/${userId}`)
      .pipe(catchError(this.handleError));
  }

  getFreePoints(userId: string): Observable<FreePoint[]> {
    return this.http
      .get<FreePoint[]>(`${this.apiUrl}/user/${userId}/free`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // You can customize error handling here
    return throwError(() => error);
  }
}
