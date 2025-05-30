import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddShopComponent } from './Components/add-shop/add-shop.component';
import { ProductFormPageComponent } from './Components/product-form-page/product-form-page.component';
import { authGuard } from '../../core/guards/Auth.guard';
import { ProductDetailsPageComponent } from './Components/product-details-page/product-details-page.component';
import { EditShopComponent } from './Components/edit-shop/edit-shop.component';
import { Subscription } from 'rxjs';
import { ProductListPageComponent } from './Components/product-list-page/product-list-page.component';
import { SubScrptionComponent } from './Components/SubScrption/SubScrption.component';
import { CommonModule } from '@angular/common';
const routes: Routes = [
  { path: 'suscrption', component: Subscription },

  //   { path: 'add-product', component:  },
  { path: 'products', component: ProductListPageComponent },
  // provider-routing.module.ts
  {
    path: 'products/add',
    component: ProductFormPageComponent,
    // data: { expectedRoles: ['Provider'] },
    // canActivate: [authGuard],
  },
  {
    path: 'products/edit/:id',
    component: ProductFormPageComponent,
    // data: { mode: 'edit', expectedRoles: ['Provider'] },
    // canActivate: [authGuard],
  },
  {
    path: 'products/details/:id',
    component: ProductDetailsPageComponent,
    // data: { expectedRoles: ['Provider'] },
    // canActivate: [authGuard]
  },

  { path: 'add-shop', component: AddShopComponent },
  { path: 'edit-shop/:id', component: EditShopComponent },
  { path: 'subscription', component: SubScrptionComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderRoutingModule {}
