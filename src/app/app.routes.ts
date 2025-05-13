import { Routes } from '@angular/router';
import   { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // {
  //   path: '',
  //   canActivate: [authGuard],
  //   loadChildren: () =>
  //     import('./modules/secure/secure.module').then((m) => m.SecureModule),
  // },
  {
    path: '',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
];
