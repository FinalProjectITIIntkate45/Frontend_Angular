import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShopsSectionComponent } from './components/Shop-section/shops-section.component';
import { AchievementsSectionComponent } from './components/achievements-section/achievements-section.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { DonationsSectionComponent } from './components/donations-section/donations-section.component';
import { FollowSellerComponent } from './components/follow-seller/follow-seller.component';
import { DrdersSectionComponent } from './components/orders-section/orders-section.component';
import { PointsSectionComponent } from './components/points-section/points-section.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { ProfileSectionComponent } from './components/profile-section/profile-section.component';
import { RecyclingSectionComponent } from './components/recycling-section/recycling-section.component';
import { SettingsSectionComponent } from './components/settings-section/settings-section.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { WalletSectionComponent } from './components/wallet-section/wallet-section.component';
import { WishlistSectionComponent } from './components/wishlist-section/wishlist-section.component';

const routes: Routes = [
  {
    path: 'products',
    children: [
      { path: '', component: ProductSearchComponent },
      { path: ':id', component: ProductDetailsComponent },
    ],
  },
  {
    path: '',
    component: UserProfileComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileSectionComponent },
      { path: 'wallet', component: WalletSectionComponent },
      { path: 'orders', component: DrdersSectionComponent },
      { path: 'points', component: PointsSectionComponent },
      { path: 'recycling', component: RecyclingSectionComponent },
      { path: 'donations', component: DonationsSectionComponent },
      { path: 'wishlist', component: WishlistSectionComponent },
      { path: 'achievements', component: AchievementsSectionComponent },
      { path: 'settings', component: SettingsSectionComponent },
      { path: 'cart', component: CartComponent },
      { path: 'follow-seller', component: FollowSellerComponent },
      { path: 'shop', component: ShopsSectionComponent },
      { path: 'checkout', component: CheckoutComponent },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClientRoutingModule {}
