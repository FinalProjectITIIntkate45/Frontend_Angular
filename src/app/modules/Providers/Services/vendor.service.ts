import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../.././../environments/environment';
import { VendorProfile } from '../Models/vendor-profile.model';
import { EditVendorProfile } from '../Models/edit-vendor-profile.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class VendorService {
  updateProfile(model: EditVendorProfile) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getVendorProfile(): Observable<VendorProfile> {
    return this.http.get<any>(`${this.baseUrl}/Account/VendorProfile`).pipe(
      map((response) => {
        const d = response.Data;
        return {
          userId: d.UserId,
          userName: d.UserName,
          email: d.Email,
          phoneNumber: d.PhoneNumber,
          profileImg: d.ProfileImg,
          nationalID: d.NationalID,
          shopId: d.ShopId,
          shopName: d.ShopName,
          shopDescription: d.ShopDescription,
          shopAddress: d.ShopAddress,
          city: d.City,
          street: d.Street,
          postalCode: d.PostalCode,
          businessPhone: d.BusinessPhone,
          businessEmail: d.BusinessEmail,
          shopLogo: d.ShopLogo,
          latitude: d.Latitude,
          longitude: d.Longitude,
          balancePoints: d.BalancePoints,
          totalShopPoints: d.TotalShopPoints,
          totalFreePoints: d.TotalFreePoints,
          totalPendingPoints: d.TotalPendingPoints,
          hasActiveSubscription: d.HasActiveSubscription,
          subscriptionExpireDate: d.SubscriptionExpireDate,
          subscriptionType: d.SubscriptionType,
          totalRevenue: d.TotalRevenue,
          orderCount: d.OrderCount,
          averageCustomerRating: d.AverageCustomerRating,
          shippingOptions: d.ShippingOptions,
        } as VendorProfile;
      })
    );
  }

  updateVendorProfile(model: EditVendorProfile): Observable<any> {
    return this.http.put(`${this.baseUrl}/Account/UpdateVendorProfile`, model);
  }
}
