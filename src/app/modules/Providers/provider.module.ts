import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProviderRoutingModule } from './provider-routing.module';
import { AddShopComponent } from './Components/add-shop/add-shop.component';
import { ProviderSidebarComponent } from './Components/provider-sidebar/provider-sidebar.component';
import { ProviderLayoutComponent } from './Components/provider-layout/provider-layout.component';
import { AuthInterceptor } from '../../core/interceptors/AuthInterceptor';
import { LoaderInterceptor } from '../../core/interceptors/loaderInterceptor';
import { ProductFormPageComponent } from './Components/product-form-page/product-form-page.component';
import { EditShopComponent } from './Components/edit-shop/edit-shop.component';
import { SubScrptionComponent } from './Components/SubScrption/SubScrption.component';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AddShopComponent,
    EditShopComponent,
    ProviderSidebarComponent,
    ProviderLayoutComponent,
    SubScrptionComponent,
    // ProductFormPageComponent,
    // ProductDetailsPageComponent,
    

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductFormPageComponent,
    RouterModule,

  ],
  providers: [
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor, LoaderInterceptor])),
  ],

})
export class ProdiverModule {}


