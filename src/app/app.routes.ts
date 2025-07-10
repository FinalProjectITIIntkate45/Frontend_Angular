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
  {
    path: 'provider',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/Providers/provider.module').then((m) => m.ProviderModule),
  },
  {
    path: 'Recycling',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/Recycling/recycling.module').then((m) => m.RecyclingModule),
  },
];
