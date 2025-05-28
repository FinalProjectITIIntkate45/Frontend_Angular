import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/Auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const authReq = token
  ? req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
  : req;
  
  console.log(authReq);
  return next(authReq);
};
