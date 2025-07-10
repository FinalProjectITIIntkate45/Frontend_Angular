import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, map, Observable } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';

import { APIResponse } from '../models/APIResponse';
import { AuthState, LoginResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'role';
  private readonly USERNAME_KEY = 'userName';

  private readonly apiUrl = `${environment.apiUrl}/Account`;

  private authState = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private http: HttpClient
  ) {
    this.initializeAuth();
  }

  private initializeAuth() {
    const token = this.getToken();
    // console.log('first token:', token);
    if (token) {
      const user = this.parseJwt(token);
      // console.log('user:', user);
      this.authState.next({
        isAuthenticated: true,
        user: {
          userName: user?.userName,
          email: user?.email,
          role: user?.role,
          subscriptionType: user?.subscriptionType || 'Basic',
        },
      });
      // console.log('authState:', this.authState);
    } else {
      this.authState.next({
        isAuthenticated: false,
        user: null,
      });
    }
  }

  getAuthState(): Observable<AuthState> {
    // console.log('getAuthState:', this.authState);
    return this.authState.asObservable();
  }

  setUserData(response: LoginResponse): void {
    // const decoded = this.parseJwt(response.token); // ✅ فك التوكن
    // console.log('decoded:', decoded);
    // console.log('response:', response);
    this.cookieService.set(this.TOKEN_KEY, response.token);
    this.cookieService.set(this.ROLE_KEY, response.role);
    this.cookieService.set(this.USERNAME_KEY, response.username);
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.ROLE_KEY, response.role);

    this.authState.next({
      isAuthenticated: true,
      user: {
        userName: response.username,
        email: response.email,
        role: response.role,
        // subscriptionType: decoded?.subscriptionType || 'Basic',
      },
    });
    // console.log('authState:', this.authState);
  }

  getToken(): string | null {
    return (
      this.cookieService.get(this.TOKEN_KEY) ||
      localStorage.getItem(this.TOKEN_KEY) ||
      null
    );
  }

  isLoggedUser(): boolean {
    // console.log('auth Service isLoggedUser:', this.getToken());
    return !!this.getToken();
  }

  getUserRole(): string {
    return (
      this.cookieService.get(this.ROLE_KEY) ||
      localStorage.getItem(this.ROLE_KEY) ||
      ''
    );
  }

  getUserSubscriptionType(): string {
    const token = this.getToken();
    if (token) {
      const decoded = this.parseJwt(token);
      return decoded?.subscriptionType || 'Basic';
    }
    return 'Basic';
  }

  // getUserId(): string {
  //   const token = this.getToken();
  //   if (token) {
  //     const decoded = this.parseJwt(token);
  //     // return decoded?.nameid || decoded?.sub || '';
  //     return (
  //       decoded?.nameid ||
  //       decoded?.sub ||
  //       decoded?.[
  //         'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
  //       ] ||
  //       ''
  //     );
  //   }
  //   return '';
  // }

  // src/app/core/services/Auth.service.ts
  getUserID(): Observable<string> {
    return this.http
      .get<APIResponse<string>>(`${this.apiUrl}/GetId`)
      .pipe(map((res: APIResponse<string>) => res.Data));
  }

  logout(): void {
    // Clear cookies
    this.cookieService.delete(this.TOKEN_KEY);
    this.cookieService.delete(this.ROLE_KEY);
    this.cookieService.delete(this.USERNAME_KEY);

    // Clear localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.USERNAME_KEY);

    // Clear all auth-related data from localStorage (in case there are other keys)
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.includes('auth') || key.includes('token') || key.includes('user'))
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Clear all auth-related cookies
    const allCookies = this.cookieService.getAll();
    Object.keys(allCookies).forEach((cookieName) => {
      if (
        cookieName.includes('auth') ||
        cookieName.includes('token') ||
        cookieName.includes('user')
      ) {
        this.cookieService.delete(cookieName);
      }
    });

    // Reset auth state
    this.authState.next({
      isAuthenticated: false,
      user: null,
    });

    // Navigate to login
    this.router.navigate(['/account/login']);
  }

  private parseJwt(token: string) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
}
