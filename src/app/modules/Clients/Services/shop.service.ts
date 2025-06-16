import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShopViewModel } from '../Models/shop-view-model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = 'http://localhost:5037/api/Shop';

  constructor(private http: HttpClient) {}

  getAllShops(): Observable<ShopViewModel[]> {
    return this.http.get<ShopViewModel[]>(`${this.apiUrl}/all`);
  }
}
