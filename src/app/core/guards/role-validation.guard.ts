import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/Auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleValidationGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.authService.getToken();

    if (!token) {
      console.log('🚫 No token found, redirecting to login');
      this.authService.logout();
      return false;
    }

    try {
      const decoded = this.parseJwt(token);
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (decoded.exp && decoded.exp < currentTime) {
        console.log('🕐 Token expired, redirecting to login');
        this.authService.logout();
        return false;
      }

      // Check for token-role mismatch
      const cookieRole = this.authService.getUserRole();
      const tokenRole = decoded.role;

      if (cookieRole && tokenRole && cookieRole !== tokenRole) {
        console.log('⚠️ Token-role mismatch detected, clearing auth data');
        console.log(`Cookie role: ${cookieRole}, Token role: ${tokenRole}`);
        this.authService.logout();
        return false;
      }

      // Check if route requires specific role
      const requiredRole = route.data['role'];
      if (requiredRole && tokenRole !== requiredRole) {
        console.log(
          `🚫 Access denied: required role ${requiredRole}, user role ${tokenRole}`
        );
        this.router.navigate(['/account/login']);
        return false;
      }

      console.log('✅ Role validation passed');
      return true;
    } catch (error) {
      console.log('❌ Invalid token format, redirecting to login');
      this.authService.logout();
      return false;
    }
  }

  private parseJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
}
