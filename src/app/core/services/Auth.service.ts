import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthState, LoginResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  [x: string]: any;
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

  setUserData(response: LoginResponse): void {
    this.cookieService.set(this.TOKEN_KEY, response.token, {
      secure: true,
      sameSite: 'Strict',
    });
    this.cookieService.set(this.ROLE_KEY, response.role);
    this.cookieService.set(this.USERNAME_KEY, response.userName);

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

  getToken(): string | null {
    return this.cookieService.get(this.TOKEN_KEY) || null;
  }

  isLoggedUser(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string {
    return this.cookieService.get(this.ROLE_KEY) || '';
  }

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
