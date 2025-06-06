import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ShopEditViewModel, ShopCreateModel } from '../Models/shop.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private baseUrl = `${environment.apiUrl}/Shop`;

  constructor(private http: HttpClient) {}

  addShop(model: ShopCreateModel): Observable<string> {
    const formData = new FormData();
    formData.append('name', model.shopName);
    formData.append('description', model.description);
    formData.append('address', model.address);
    formData.append('city', model.city);
    formData.append('street', model.street);
    formData.append('postalCode', model.postalCode);
    formData.append('latitude', model.latitude.toString());
    formData.append('longitude', model.longitude.toString());
    formData.append('businessPhone', model.businessPhone);
    formData.append('businessEmail', model.businessEmail);
    if (model.logo) formData.append('logoFile', model.logo);
    if (model.images) {
      model.images.forEach((file, index) => {
        formData.append(`imagesFiles[${index}]`, file);
      });
    }
    formData.append('providerId', model.providerId || '');
    formData.append('typeId', model.shopTypeId.toString());

    return this.http.post<string>(`${this.baseUrl}/add`, formData);
  }

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
