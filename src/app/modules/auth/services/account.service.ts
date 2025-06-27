// src/app/services/account.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';

import { ProfileView } from '../models/profile-view.model';
import { UserRegisterRequest } from '../models/user-register.model';
import { environment } from '../../../../environments/environment.development';
import { APIResponse } from '../../../core/models/APIResponse';
import { LoginRequest, LoginResponse } from '../../../core/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Account`;

  register(user: UserRegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/Register`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  login(credentials: LoginRequest): Observable<APIResponse<LoginResponse>> {
    return this.http.post<APIResponse<LoginResponse>>(
      `${this.apiUrl}/Login`,
      credentials
    );
  }
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/Logout`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  getUserId(): Observable<APIResponse<string>> {
    return this.http.get<APIResponse<string>>(`${this.apiUrl}/GetId`);
  }

 getUserProfile(): Observable<APIResponse<ProfileView>> {
  return this.http.get<APIResponse<ProfileView>>(`${this.apiUrl}/GetProfile`).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('API Error:', error);
      return throwError(() => error);
    })
  );
}

}
