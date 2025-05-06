import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedUserSubject: BehaviorSubject<boolean>
  constructor() {
    this.isLoggedUserSubject = new BehaviorSubject<boolean>(this.isLoggedUser())
  }

  isLoggedUser(): boolean {
    return (localStorage.getItem('Access_Token') == null) ? false : true
  }
  getToken(): string {
    return localStorage.getItem('Access_Token') ?? ""
  }

  userLogin(token: string) {
    localStorage.setItem('Access_Token', token)
    this.isLoggedUserSubject.next(true)
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
