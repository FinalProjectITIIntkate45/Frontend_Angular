import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/Auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
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
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();

<<<<<<< HEAD
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(authReq);
  }

  return next(req);
=======
  const authReq = token
  ? req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
  : req;
  
  console.log(authReq);
  return next(authReq);
>>>>>>> d45a1590fe7ac7782b2133eb490410fd9a125cc2
};
