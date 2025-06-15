import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Charity } from '../Models/Charity.model';

@Injectable({
  providedIn: 'root'
})
export class CharityService {
  private baseUrl = 'https://localhost:44352/api/Charity';

  constructor(private http: HttpClient) {}

  getAllCharities(): Observable<Charity[]> {
    return this.http.get<Charity[]>(`${this.baseUrl}/getall`);
  }

 
}
