import { Component, OnInit } from '@angular/core';
import { LoaderService } from './core/services/loader.service';
import { AuthService } from './core/services/Auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'PointPay';
  userType: string = 'user';
  isLoading: boolean = false;

  constructor(
    public loaderService: LoaderService,
    private authService: AuthService
  ) {
    this.loaderService.isloading.subscribe((loading: boolean) => {
      this.isLoading = loading;
      if (loading) {
        console.log('Loading started');
      } else {
        console.log('Loading finished');
      }
    });
    // You can initialize userType based on some logic or service if needed
  }

  ngOnInit(): void {
    this.validateTokenOnStartup();
  }

  private validateTokenOnStartup(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        const decoded = this.parseJwt(token);
        const currentTime = Date.now() / 1000;

        // Check if token is expired
        if (decoded.exp && decoded.exp < currentTime) {
          console.log('🕐 Token expired, clearing auth data');
          this.authService.logout();
          return;
        }

        // Check for token-role mismatch
        const cookieRole = this.authService.getUserRole();
        const tokenRole = decoded.role;

        if (cookieRole && tokenRole && cookieRole !== tokenRole) {
          console.log('⚠️ Token-role mismatch detected, clearing auth data');
          console.log(`Cookie role: ${cookieRole}, Token role: ${tokenRole}`);
          this.authService.logout();
          return;
        }

        console.log('✅ Token validation passed');
      } catch (error) {
        console.log('❌ Invalid token format, clearing auth data');
        this.authService.logout();
      }
    }
  }

  private parseJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  setUserType(type: string) {
    this.userType = type;
  }
}
