import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ShopEditViewModel } from '../Models/shop.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private baseUrl = `${environment.apiUrl}/Shop`;

  constructor(private http: HttpClient) {}

  updateShop(model: ShopEditViewModel): Observable<string> {
    const formData = new FormData();
    formData.append('id', model.id.toString());
    formData.append('shopName', model.shopName);
    formData.append('description', model.description);
    formData.append('address', model.address);
    formData.append('contactDetails', model.contactDetails);
    if (model.logo) formData.append('logo', model.logo);

    return this.http.put<string>(`${this.baseUrl}/edit`, formData);
  }

  getShopById(shopId: number): Observable<ShopEditViewModel> {
    return this.http.get<ShopEditViewModel>(`${this.baseUrl}/${shopId}`);
  }
}
