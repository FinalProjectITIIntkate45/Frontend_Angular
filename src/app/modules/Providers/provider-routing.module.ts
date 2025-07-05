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
import { ShopProductsComponent } from './Components/OfferGroupe/ShopProducts/ShopProducts.component';
import { ShopOffersComponent } from './Components/OfferGroupe/ShopOffers/ShopOffers.component';
import { EditOfferComponent } from './Components/OfferGroupe/EditOffer/EditOffer.component';
import { OfferProductManagerComponent } from './Components/OfferGroupe/OfferProductManager/OfferProductManager.component';
import { OfferDetailesComponent } from './Components/OfferGroupe/OfferDetailes/OfferDetailes.component';
import { MakeOfferComponent } from './Components/OfferGroupe/MakeOffer/MakeOffer.component';
import { EditDetailsComponent } from './Components/OfferGroupe/editDetailes/editDetailes.component';
import { ProviderOrdersComponent } from './Components/provider-orders/provider-orders.component';
import { ProviderDashboardComponent } from './Components/provider-dashboard/provider-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: ProviderLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ProviderDashboardComponent },
      { path: 'products', component: ProductListPageComponent },
      { path: 'products/add', component: ProductFormPageComponent },
      { path: 'products/edit/:id', component: ProductFormPageComponent },
      { path: 'products/details/:id', component: ProductDetailsPageComponent },
      { path: 'add-shop', component: AddShopComponent },
      { path: 'edit-shop/:id', component: EditShopComponent },
      { path: 'subscription', component: SubScrptionComponent },
      { path: 'ShowProductorOffer', component: ShopProductsComponent },
      { path: 'ShowShopOffer', component: ShopOffersComponent },
      { path: 'edit-offer/:id', component: EditDetailsComponent },
      { path: 'edit-offer-products/:id', component: EditOfferComponent },
      {
        path: 'offer-product-manager/:offerId',
        component: OfferProductManagerComponent,
      },
      { path: 'offer-details/:id', component: OfferDetailesComponent },
      { path: 'make-offer', component: MakeOfferComponent },
      { path: 'provider-orders', component: ProviderOrdersComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderRoutingModule {}
