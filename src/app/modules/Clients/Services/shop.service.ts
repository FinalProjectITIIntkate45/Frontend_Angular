import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShopViewModel } from '../Models/shop-view-model';
import { environment } from '../../../../environments/environment';
import { APIResponse } from '../../../core/models/APIResponse';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private baseUrl = `${environment.apiUrl}/Shop`;

  constructor(private http: HttpClient) {}

  getAllShops() {
    return this.http.get<APIResponse<ShopViewModel[]>>(`${this.baseUrl}/all`);
  }
}
