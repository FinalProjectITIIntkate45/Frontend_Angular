import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/Auth.service';
import { Router, type CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService);
  const router = inject(Router);

  if (!_AuthService.isLoggedUser()) {
    alert('Sorry, you must login first');
    router.navigate(['/login', state.url]);
    return false;
  }

  const expectedRoles: string[] = route.data?.['expectedRoles'];
  const userRole = _AuthService.getUserRole(); //   "Admin", "Client", ...

  if (expectedRoles && !expectedRoles.includes(userRole)) {
    alert('You are not authorized to access this page');
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
