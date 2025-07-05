import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';

import { AuthState, LoginResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'role';
  private readonly USERNAME_KEY = 'userName';

  private authState = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  constructor(private cookieService: CookieService, private router: Router) {
    this.initializeAuth();
  }

  private initializeAuth() {
    const token = this.getToken();
    console.log('first token:', token);
    if (token) {
      const user = this.parseJwt(token);
      console.log('user:', user);
      this.authState.next({
        isAuthenticated: true,
        user: {
          userName: user?.userName,
          email: user?.email,
          role: user?.role,
          subscriptionType: user?.subscriptionType || 'Basic',
        },
      });
      console.log('authState:', this.authState);
    } else {
      this.authState.next({
        isAuthenticated: false,
        user: null,
      });
    }
  }

  getAuthState(): Observable<AuthState> {
    console.log('getAuthState:', this.authState);
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
    console.log('authState:', this.authState);
  }

  getToken(): string | null {
    return (
      this.cookieService.get(this.TOKEN_KEY) ||
      localStorage.getItem(this.TOKEN_KEY) ||
      null
    );
  }

  isLoggedUser(): boolean {
    console.log('auth Service isLoggedUser:', this.getToken());
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

  logout(): void {
    this.cookieService.delete(this.TOKEN_KEY);
    this.cookieService.delete(this.ROLE_KEY);
    this.cookieService.delete(this.USERNAME_KEY);

    this.authState.next({
      isAuthenticated: false,
      user: null,
    });

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
