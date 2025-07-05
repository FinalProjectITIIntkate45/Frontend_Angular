import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../.././../environments/environment';
import { VendorProfile } from '../Models/vendor-profile.model';
import { EditVendorProfile } from '../Models/edit-vendor-profile.model';

@Injectable({ providedIn: 'root' })
export class VendorService {
  updateProfile(model: EditVendorProfile) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getVendorProfile(): Observable<VendorProfile> {
    return this.http.get<VendorProfile>(`${this.baseUrl}/Account/VendorProfile`);
  }

  updateVendorProfile(model: EditVendorProfile): Observable<any> {
    return this.http.put(`${this.baseUrl}/Account/UpdateVendorProfile`, model);
  }
}
