// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientLayoutComponent } from './modules/Clients/components/client-layout/client-layout.component';
import { ProviderLayoutComponent } from './modules/Providers/Components/provider-layout/provider-layout.component';
import { authGuard } from './core/guards/Auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'account',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'provider',
    component: ProviderLayoutComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['Provider'] },
    loadChildren: () =>
      import('./modules/Providers/provider.module').then(
        (m) => m.ProdiverModule
      ),
  },
  {
    path: 'client',
    component: ClientLayoutComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['Client'] },
    loadChildren: () =>
      import('./modules/Clients/client.module').then((m) => m.ClientModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
