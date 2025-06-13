import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfileSectionComponent } from './components/profile-section/profile-section.component';
import { WalletSectionComponent } from './components/wallet-section/wallet-section.component';
import { DrdersSectionComponent } from './components/orders-section/orders-section.component';
import { PointsSectionComponent } from './components/points-section/points-section.component';
import { RecyclingSectionComponent } from './components/recycling-section/recycling-section.component';
import { DonationsSectionComponent } from './components/donations-section/donations-section.component';
import { SettingsSectionComponent } from './components/settings-section/settings-section.component';
import { SharedModule } from '../../shared/shared.module';
import { ClientRoutingModule } from './client-routing.module';
import { AchievementsSectionComponent } from './components/achievements-section/achievements-section.component';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ClientLayoutComponent } from './components/client-layout/client-layout.component';
import { UserNavComponent } from './components/user-nav/user-nav.component';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthInterceptor } from '../../core/interceptors/AuthInterceptor';
import { LoaderInterceptor } from '../../core/interceptors/loaderInterceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { WishlistSectionComponent } from './components/wishlist-section/wishlist-section.component';
import { UserFooterComponent } from './components/user-footer/user-footer.component';
import { FollowSellerService } from './Services/follow.service';
import { FollowSellerComponent } from './components/follow-seller/follow-seller.component';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductNavbarComponent } from '../../shared/components/product-navbar/product-navbar.component';

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
    DonationsSectionComponent,
    AchievementsSectionComponent,
    SettingsSectionComponent,
    ClientLayoutComponent,
    UserNavComponent,
    ProductSearchComponent,
    ProductDetailsComponent,
    UserFooterComponent,
    WishlistSectionComponent,
    FollowSellerComponent,
    CartComponent
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
