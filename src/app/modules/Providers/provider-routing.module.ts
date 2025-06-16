import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { Subscription } from 'rxjs';

import { authGuard } from '../../core/guards/Auth.guard';

import { SubScrptionComponent } from './Components/SubScrption/SubScrption.component';
import { AddShopComponent } from './Components/add-shop/add-shop.component';
import { EditShopComponent } from './Components/edit-shop/edit-shop.component';
import { ProductDetailsPageComponent } from './Components/product-details-page/product-details-page.component';
import { ProductFormPageComponent } from './Components/product-form-page/product-form-page.component';
import { ProductListPageComponent } from './Components/product-list-page/product-list-page.component';
import { ProviderLayoutComponent } from './Components/provider-layout/provider-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ProviderLayoutComponent,
    children: [
      { path: 'products', component: ProductListPageComponent },
      { path: 'products/add', component: ProductFormPageComponent },
      { path: 'products/edit/:id', component: ProductFormPageComponent },
      { path: 'products/details/:id', component: ProductDetailsPageComponent },
      { path: 'add-shop', component: AddShopComponent },
      { path: 'edit-shop/:id', component: EditShopComponent },
      { path: 'subscription', component: SubScrptionComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderRoutingModule {}
