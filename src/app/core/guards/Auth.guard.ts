import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/Auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Attempted URL:', state.url);

  if (authService.isLoggedUser()) {
    return true;
  } else {
    alert('Sorry You Must login First');
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
