import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Subscription } from 'rxjs';

import { AuthInterceptor } from '../../core/interceptors/AuthInterceptor';
import { LoaderInterceptor } from '../../core/interceptors/loaderInterceptor';

import { ProviderRoutingModule } from './provider-routing.module';

import { SubScrptionComponent } from './Components/SubScrption/SubScrption.component';
import { AddShopComponent } from './Components/add-shop/add-shop.component';
import { EditShopComponent } from './Components/edit-shop/edit-shop.component';
import { ProductDetailsPageComponent } from './Components/product-details-page/product-details-page.component';
import { ProductFormPageComponent } from './Components/product-form-page/product-form-page.component';
import { ProductListPageComponent } from './Components/product-list-page/product-list-page.component';
import { ProviderLayoutComponent } from './Components/provider-layout/provider-layout.component';
import { ProviderSidebarComponent } from './Components/provider-sidebar/provider-sidebar.component';


@NgModule({
  declarations: [
    ProviderLayoutComponent,
    AddShopComponent,
    EditShopComponent,
    ProviderSidebarComponent,
    SubScrptionComponent,
    ProductFormPageComponent,
    ProductDetailsPageComponent,
    ProductListPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProviderRoutingModule, // هذا هو الصحيح، وليس RouterModule فقط
  ],
  providers: [
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor, LoaderInterceptor])),
  ],
})
export class ProviderModule {}


