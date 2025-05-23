// src/app/services/account.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { LoginRequest, LoginResponse } from '../../../core/models/auth.models';
import { UserRegisterRequest } from '../models/user-register.model';
import { APIResponse } from '../../../core/models/APIResponse';

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
}
