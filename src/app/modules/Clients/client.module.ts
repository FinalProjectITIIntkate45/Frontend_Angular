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

import { ShopsSectionComponent } from './components/Shop-section/shops-section.component';
import { AchievementsSectionComponent } from './components/achievements-section/achievements-section.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ClientLayoutComponent } from './components/client-layout/client-layout.component';
import { FollowSellerComponent } from './components/follow-seller/follow-seller.component';
import { OrdersSectionComponent } from './components/orders-section/orders-section.component';
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
import { OrderSummaryComponent } from './components/checkout/order-summary/order-summary.component';
import { PaymentConfirmationComponent } from './components/checkout/payment-confirmation/payment-confirmation.component';
import { PaymentInfoComponent } from './components/checkout/payment-info/payment-info.component';
import { ClientOrderDetailsComponent } from './components/orders-section/client-order-details/client-order-details.component';
import { WalletRechargeComponent } from './components/wallet-recharge/wallet-recharge.component';
import { WalletSuccessComponent } from './components/wallet-success/wallet-success.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ShopDetailsModalComponent } from './components/shop-details-modal/shop-details-modal.component';
import { ClientNotificationsPanelComponent } from './components/notifications-panel/notifications-panel.component';

@NgModule({
  declarations: [
    AboutUsComponent,
    UserProfileComponent,
    TopNavigationComponent,
    SidebarComponent,
    ProfileSectionComponent,
    WalletSectionComponent,
    WalletRechargeComponent,
    WalletSuccessComponent,
    OrdersSectionComponent,
    PointsSectionComponent,
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
    OrderSummaryComponent,
    ShopsSectionComponent,
    CharityListComponent,
    CharityDetailsComponent,
    DonateComponent,
    PaymentConfirmationComponent,
    RecyclingSectionComponent,
    ClientOrderDetailsComponent,
    ShopDetailsModalComponent,
    ClientNotificationsPanelComponent,
  ],

  imports: [
    CommonModule,
    SharedModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
  ],
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor, LoaderInterceptor])
    ),
  ],
})
export class ClientModule {}
