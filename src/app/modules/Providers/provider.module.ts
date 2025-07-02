
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

// Components
import { SubScrptionComponent } from './Components/SubScrption/SubScrption.component';
import { AddShopComponent } from './Components/add-shop/add-shop.component';
import { EditShopComponent } from './Components/edit-shop/edit-shop.component';
import { ProductDetailsPageComponent } from './Components/product-details-page/product-details-page.component';
import { ProductFormPageComponent } from './Components/product-form-page/product-form-page.component';
import { ProductListPageComponent } from './Components/product-list-page/product-list-page.component';
import { ProviderLayoutComponent } from './Components/provider-layout/provider-layout.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { SafeUrlPipe } from './Services/SafeUrl.pipe';
import { EditDetailsComponent } from './Components/OfferGroupe/editDetailes/editDetailes.component';
import { EditOfferComponent } from './Components/OfferGroupe/EditOffer/EditOffer.component';
import { ShopProductsComponent } from './Components/OfferGroupe/ShopProducts/ShopProducts.component';
import { ShopOffersComponent } from './Components/OfferGroupe/ShopOffers/ShopOffers.component';
import { OfferDetailesComponent } from './Components/OfferGroupe/OfferDetailes/OfferDetailes.component';
import { MakeOfferComponent } from './Components/OfferGroupe/MakeOffer/MakeOffer.component';
import { OfferProductManagerComponent } from './Components/OfferGroupe/OfferProductManager/OfferProductManager.component';
import { ProviderOrdersComponent } from './Components/provider-orders/provider-orders.component';
import { HeaderComponent } from './Components/header/header.component';
import { SalesOverviewComponent } from './Components/sales-overview/sales-overview.component';
import { WelcomeBannerComponent } from './Components/welcome-banner/welcome-banner.component';
import { ChartContainerComponent } from './Components/chart-container/chart-container.component';
import { NotificationsPanelComponent } from './Components/notifications-panel/notifications-panel.component';
import { OrdersTableComponent } from './Components/orders-table/orders-table.component';
import { StatsCardComponent } from './Components/stats-card/stats-card.component';
import { EditVendorProfileComponent } from './Components/EditVendorProfile/EditVendorProfile.component';
import { VendorProfileComponent } from './Components/vendor-profile/vendor-profile.component';
import { ReviewsComponent } from './Components/reviews/reviews.component';
import { CategoriesComponent } from './Components/categories/categories.component';
import { FollowersComponent } from '../Providers/Components/followers/followers.component';
import{ ShopsComponent } from '../Providers/Components/Shops/Shops.component';


@NgModule({
  declarations: [
    ProviderLayoutComponent,
    AddShopComponent,
    EditShopComponent,
    ProviderOrdersComponent,
    SubScrptionComponent,
    ProductFormPageComponent,
    ProductDetailsPageComponent,
    ProductListPageComponent,
    EditDetailsComponent,
    EditOfferComponent,
    ShopProductsComponent,
    ShopOffersComponent,
    OfferDetailesComponent,
    MakeOfferComponent,
    OfferProductManagerComponent,
    SidebarComponent,
    HeaderComponent,
    WelcomeBannerComponent,
    SalesOverviewComponent,
    OrdersTableComponent,
    NotificationsPanelComponent,
    ChartContainerComponent,
    StatsCardComponent,
    EditVendorProfileComponent,
    VendorProfileComponent,
    ReviewsComponent,
    CategoriesComponent,
    FollowersComponent,
    ShopsComponent,
  ],
  exports: [
    ProviderLayoutComponent,
    AddShopComponent,
    EditShopComponent,
    SubScrptionComponent,
    SidebarComponent,
    HeaderComponent,
    WelcomeBannerComponent,
    SalesOverviewComponent,
    OrdersTableComponent,
    NotificationsPanelComponent,
    ChartContainerComponent,
    StatsCardComponent,
    ProductFormPageComponent,
    ProductDetailsPageComponent,
    ProductListPageComponent,
    ProviderOrdersComponent,
    EditDetailsComponent,
    EditVendorProfileComponent,
    VendorProfileComponent,
    ReviewsComponent,
    CategoriesComponent,
    FollowersComponent,
    ShopsComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProviderRoutingModule,
    SafeUrlPipe,
  ],
  providers: [
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor, LoaderInterceptor]))
  ],
})
export class ProviderModule {}

