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
import { TopNavigationComponent } from '../Clients/components/top-navigation/top-navigation.component';
import { SidebarComponent } from '../Clients/components/sidebar/sidebar.component';
import { ProviderLayoutComponent } from './Components/provider-layout/provider-layout.component';
import { AuthInterceptor } from '../../core/interceptors/AuthInterceptor';
import { LoaderInterceptor } from '../../core/interceptors/loaderInterceptor';
import { ProductFormPageComponent } from './Components/product-form-page/product-form-page.component';

@NgModule({
  declarations: [
    AddShopComponent,
    ProviderSidebarComponent,
    ProviderLayoutComponent,
    ProductFormPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProviderRoutingModule,
  ],
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor, LoaderInterceptor])
    ),
  ],
})
export class ProdiverModule {}
