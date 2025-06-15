import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private baseUrl = `${environment.apiUrl}/Shop`;

  constructor(private http: HttpClient) {}

  addShop(model: FormData): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/add`, model);
  }

  getAllShops(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  getShopById(shopId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${shopId}`);
  }

  updateShop(model: FormData): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/edit`, model);
  }
}
