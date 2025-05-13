// src/app/services/account.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegisterViewModel } from '../models/user-register.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly apiUrl = 'https://localhost:7109/api/Account'; // Change if port differs

  constructor(private http: HttpClient) {}

  register(user: UserRegisterViewModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/Register`, user);
  }

  login(data: { method: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, data);
  }

  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetRoles`);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/Logout`, {});
  }
}
