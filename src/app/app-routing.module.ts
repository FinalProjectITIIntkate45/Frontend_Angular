// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './core/guards/Auth.guard';
import { ClientLayoutComponent } from './modules/Clients/components/client-layout/client-layout.component';
import { ProviderLayoutComponent } from './modules/Providers/Components/provider-layout/provider-layout.component';
import { HomeLayoutComponent } from './modules/home/components/home-layout/home-layout.component';


const routes: Routes = [
  // { path: '', redirectTo: 'client/products', pathMatch: 'full' },
  {
    path: 'account',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: 'provider',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/Providers/provider.module').then(
        (m) => m.ProviderModule
      ),
  },
  {
    path: 'client',
    component: ClientLayoutComponent,

    canActivate: [authGuard],
    // data: { expectedRoles: ['Client'] },
    loadChildren: () =>
      import('./modules/Clients/client.module').then((m) => m.ClientModule),
  },
  {
    path: 'Recycler',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/Recycling/recycling.module').then(
        (m) => m.RecyclingModule
      ),
  },
  {
    path: '',
    component: HomeLayoutComponent,
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  // { path: '', redirectTo: 'clients/follow-seller', pathMatch: 'full' },
  // {
  //   path: 'clients',
  //   loadChildren: () =>
  //     import('./modules/Clients/client.module').then((m) => m.ClientModule),
  // },

  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
