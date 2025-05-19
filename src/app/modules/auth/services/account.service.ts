// src/app/services/account.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegisterViewModel } from '../models/user-register.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginRequest, LoginResponse } from '../../../core/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly apiUrl = `${environment.apiUrl}/api/Account`;

  constructor(private http: HttpClient) {}

  register(user: UserRegisterViewModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/Register`, user);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Login`, credentials);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/GetRoles`);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/Logout`, {});
  }
}
