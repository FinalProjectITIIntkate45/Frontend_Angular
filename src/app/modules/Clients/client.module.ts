import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { AuthInterceptor } from '../../core/interceptors/AuthInterceptor';
import { LoaderInterceptor } from '../../core/interceptors/loaderInterceptor';
import { ProductNavbarComponent } from '../../shared/components/product-navbar/product-navbar.component';

import { ClientRoutingModule } from './client-routing.module';

import { FollowSellerService } from './Services/follow.service';
import { ShopsSectionComponent } from './components/Shop-section/shops-section.component';
import { AchievementsSectionComponent } from './components/achievements-section/achievements-section.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ClientLayoutComponent } from './components/client-layout/client-layout.component';
import { FollowSellerComponent } from './components/follow-seller/follow-seller.component';
import { DrdersSectionComponent } from './components/orders-section/orders-section.component';
import { PointsSectionComponent } from './components/points-section/points-section.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { ProfileSectionComponent } from './components/profile-section/profile-section.component';
import { RecyclingSectionComponent } from './components/recycling-section/recycling-section.component';
import { SettingsSectionComponent } from './components/settings-section/settings-section.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import { UserFooterComponent } from './components/user-footer/user-footer.component';
import { UserNavComponent } from './components/user-nav/user-nav.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { WalletSectionComponent } from './components/wallet-section/wallet-section.component';
import { WishlistSectionComponent } from './components/wishlist-section/wishlist-section.component';
import { CharityDetailsComponent } from './components/charity/charity-details/charity-details.component';
import { CharityListComponent } from './components/charity/charity-list/charity-list.component';
import { DonateComponent } from './components/charity/donate/donate.component';
import { DeliveryInfoComponent } from './components/checkout/delivery-info/delivery-info.component';
import { OrderConfirmationComponent } from './components/checkout/order-confirmation/order-confirmation.component';
import { PaymentInfoComponent } from './components/checkout/payment-info/payment-info.component';


@NgModule({
  declarations: [
    UserProfileComponent,
    TopNavigationComponent,
    SidebarComponent,
    ProfileSectionComponent,
    WalletSectionComponent,
    DrdersSectionComponent,
    PointsSectionComponent,
    RecyclingSectionComponent,
    AchievementsSectionComponent,
    SettingsSectionComponent,
    ClientLayoutComponent,
    UserNavComponent,
    ProductSearchComponent,
    ProductDetailsComponent,
    UserFooterComponent,
    WishlistSectionComponent,
    FollowSellerComponent,
    CartComponent,
    ProductNavbarComponent,
    CartComponent,
    ProductNavbarComponent,
    CheckoutComponent,
    DeliveryInfoComponent,
    PaymentInfoComponent,
    OrderConfirmationComponent,

    ShopsSectionComponent,

    CharityListComponent,
    CharityDetailsComponent,
    DonateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor, LoaderInterceptor])
    ),
  ],

})export class ClientModule {}
