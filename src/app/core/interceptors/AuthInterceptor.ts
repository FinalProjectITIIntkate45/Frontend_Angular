import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/Auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {

  let authService= inject(AuthService)
  
  const token= authService.getToken()
  console.log("in interceptor token: ",token);
  
  if(token){
    
    const headers = req.headers.set('Authorization', `Bearer ${token}`);
    const authReq = req.clone({ headers });
    
    return next(authReq);
  }
  return next(req);
};