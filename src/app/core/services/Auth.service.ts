import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isLoggedUserSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedUserSubject = new BehaviorSubject<boolean>(this.isLoggedUser());
  }

  isLoggedUser(): boolean {
    return localStorage.getItem('Access_Token') !== null;
  }
  getToken(): string {
    return localStorage.getItem('Access_Token') ?? ""
  }

  userLogin(token: string): void {
    localStorage.setItem('Access_Token', token);
    this.isLoggedUserSubject.next(true);
  }
  userLogout() {
    localStorage.removeItem('Access_Token')
    this.isLoggedUserSubject.next(false)
  }
  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || '';
    } catch (error) {
      console.error('Invalid token format', error);
      return '';
    }
  }


}
