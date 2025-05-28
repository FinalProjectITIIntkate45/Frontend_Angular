import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/Auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService);
  const router = inject(Router);

  // Allow public routes
  const publicRoutes = [
    '/client/Product',
    '/account/login',
    '/account/register',
  ];

  if (publicRoutes.some((route) => state.url.startsWith(route))) {
    return true;
  }

  if (!_AuthService.isLoggedUser()) {
    router.navigate(['/account/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  const expectedRoles: string[] = route.data?.['expectedRoles'];
  const userRole = _AuthService.getUserRole();

  if (expectedRoles && !expectedRoles.includes(userRole)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
