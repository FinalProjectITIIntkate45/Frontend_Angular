import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Charity } from '../Models/Charity.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CharityService {
  private baseUrl = `${environment.apiUrl}/Charity`;

  constructor(private http: HttpClient) {}

  getAllCharities(): Observable<Charity[]> {
    return this.http.get<Charity[]>(`${this.baseUrl}/getall`);
  }

 
}
