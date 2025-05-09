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
    return localStorage.getItem('Access_Token') ?? '';
  }

  userLogin(token: string): void {
    localStorage.setItem('Access_Token', token);
    this.isLoggedUserSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('Access_Token');
    this.isLoggedUserSubject.next(false);
    this.http.post(`${this.apiUrl}/Account/Logout`, {}).subscribe(() => {
      // Handle logout logic (e.g., redirect to login page)
    });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Account/GetProfile`);
  }

  getIsLoggedUser(): Observable<boolean> {
    return this.isLoggedUserSubject.asObservable();
  }
}
