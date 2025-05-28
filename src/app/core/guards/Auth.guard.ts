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
<<<<<<< HEAD
    router.navigate(['/account/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
=======
  alert('Sorry, you must login first');
  router.navigate(['/account/login']);  // هذا هو المسار الصحيح
  return false;
}

>>>>>>> d45a1590fe7ac7782b2133eb490410fd9a125cc2

  const expectedRoles: string[] = route.data?.['expectedRoles'];
  const userRole = _AuthService.getUserRole();

  if (expectedRoles && !expectedRoles.includes(userRole)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
