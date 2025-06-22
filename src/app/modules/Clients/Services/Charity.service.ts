import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Charity } from '../Models/Charity.model';
import { environment } from '../../../../environments/environment';
import { Pagination } from '../../../core/models/PaginationViewModel';

@Injectable({
  providedIn: 'root'
})
export class CharityService {
  private baseUrl = `${environment.apiUrl}/Charity`;

  constructor(private http: HttpClient) {}

  getAllCharities(): Observable<Pagination<Charity>> {
    return this.http.get<Pagination<Charity>>(`${this.baseUrl}/getall`);
  }


getCharityDetails(charityId: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/ShowDetails?charityId=${charityId}`);
}


donateToCharity(donationData: { charityId: number; amount: number }): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
    // لو عندك JWT Token حابة تبعتيه:
    // 'Authorization': `Bearer ${yourToken}`
  });
  

  return this.http.post(`${this.baseUrl}/GiveDonate`, donationData, { headers });
}
}
