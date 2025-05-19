import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  AuthState,
} from '../../../core/models/auth.models';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private authState = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  constructor(private cookieService: CookieService, private router: Router) {
    this.initializeAuth();
  }

  private initializeAuth() {
    const token = this.cookieService.get(this.TOKEN_KEY);
    if (token) {
      const user = this.parseJwt(token);
      this.authState.next({
        isAuthenticated: true,
        user: {
          userName: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  }

  getAuthState(): Observable<AuthState> {
    return this.authState.asObservable();
  }

  userLogin(response: LoginResponse): void {
    // Set cookie with token
    this.cookieService.set(this.TOKEN_KEY, response.token, {
      secure: true,
      sameSite: 'Strict',
    });

    // Update auth state
    this.authState.next({
      isAuthenticated: true,
      user: {
        userName: response.userName,
        email: response.email,
        role: response.role,
      },
    });

    // Navigate based on role
    if (response.role === 'Provider') {
      this.router.navigate(['/provider']);
    } else {
      this.router.navigate(['/client']);
    }
  }

  logout(): void {
    this.cookieService.delete(this.TOKEN_KEY);
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
