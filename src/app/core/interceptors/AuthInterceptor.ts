import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/Auth.service';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // console.log(`[AuthInterceptor] Intercepting request to ${req.url}`);

  // Add public routes that don't need authentication
  const publicRoutes = [
    '/api/Product',
    '/api/Product/',
    '/api/Account/Register',
    '/api/Account/Login',
  ];

  // Check if the request URL is public
  const isPublicRoute = publicRoutes.some((route) => req.url.includes(route));

  if (isPublicRoute) {
    // console.log(`[AuthInterceptor] Public route detected: ${req.url}`);
    return next(req);
  }

  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (token) {
    // Validate token before adding to request
    try {
      const decoded = parseJwt(token);
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (decoded.exp && decoded.exp < currentTime) {
        console.log('🕐 Token expired in interceptor, clearing auth data');
        authService.logout();
        return next(req);
      }

      // Check for token-role mismatch
      const cookieRole = authService.getUserRole();
      const tokenRole = decoded.role;

      if (cookieRole && tokenRole && cookieRole !== tokenRole) {
        console.log(
          '⚠️ Token-role mismatch detected in interceptor, clearing auth data'
        );
        console.log(`Cookie role: ${cookieRole}, Token role: ${tokenRole}`);
        authService.logout();
        return next(req);
      }

      // console.log('[AuthInterceptor] Token found. Adding Authorization header.');
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      // console.log(`[AuthInterceptor] Request: `, authReq);

      return next(authReq);
    } catch (error) {
      console.log('❌ Invalid token format in interceptor, clearing auth data');
      authService.logout();
      return next(req);
    }
  } else {
    // console.warn(
    //   '[AuthInterceptor] No token found. Request will not be authenticated.'
    // );
  }

  return next(req);
};

function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}
