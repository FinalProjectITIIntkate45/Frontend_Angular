// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { ClientLayoutComponent } from './modules/Clients/components/client-layout/client-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { ProviderLayoutComponent } from './modules/Providers/Components/provider-layout/provider-layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // {path:"home",component:}
  {
    path: 'account',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'provider', component:ProviderLayoutComponent, 
    loadChildren: () => import('./modules/Providers/provider.module').then(m => m.ProdiverModule)
  },
  {
    path: 'client', component:ClientLayoutComponent,
    loadChildren: () => import('./modules/Clients/client.module').then(m => m.ClientModule)
  },

  // ... other lazy-loaded feature modules here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
