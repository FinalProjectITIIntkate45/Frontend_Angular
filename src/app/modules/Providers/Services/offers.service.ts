import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Offer } from '../Models/offer';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private apiUrl = `${environment.apiUrl}/Offers`;

  constructor(private http: HttpClient) { }

  createOffer(offer: Offer): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateOffer`, offer);
  }

  getOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}/GetOffers`);
  }

  getOffer(id: number): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/GetOfferById/${id}`);
  }

  update(id: number, offer: Offer): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateOffer/${id}`, offer);
  }

  deleteOffer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteOffer/${id}`);
  }
}
