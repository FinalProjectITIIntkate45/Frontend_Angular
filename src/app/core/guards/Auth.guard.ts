import { AuthService } from '../services/Auth.service';
import { Router, type CanActivateFn } from '@angular/router';

import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  console.log(state.url);

  const _AuthService = inject(AuthService);
  const router = inject(Router);
  if (_AuthService.isLoggedUser()) {
    return true;
  } else {
    alert('Sorry You Must login First');
    router.navigate(['/login', state.url]);
    return false;
  }
};
