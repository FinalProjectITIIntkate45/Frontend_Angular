import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/Auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`[AuthInterceptor] Intercepting request to ${req.url}`);

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
    console.log(`[AuthInterceptor] Public route detected: ${req.url}`);
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    console.log('[AuthInterceptor] Token found. Adding Authorization header.');
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(authReq);
  } else {
    console.warn(
      '[AuthInterceptor] No token found. Request will not be authenticated.'
    );
  }

  return next(req);
};
