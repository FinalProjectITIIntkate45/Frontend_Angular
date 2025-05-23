import { Routes } from '@angular/router';
import { authGuard } from './core/guards/Auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'user-profile',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/Clients/components/user-profile/user-profile.component').then((m) => m.UserProfileComponent),
  },

];
