import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfileSectionComponent } from './components/profile-section/profile-section.component';
import { WalletSectionComponent } from './components/wallet-section/wallet-section.component';
import { DrdersSectionComponent } from './components/orders-section/orders-section.component'; // تصحيح الاسم
import { PointsSectionComponent } from './components/points-section/points-section.component'; // تصحيح الاسم
import { RecyclingSectionComponent } from './components/recycling-section/recycling-section.component'; // تصحيح الاسم
import { DonationsSectionComponent } from './components/donations-section/donations-section.component'; // تصحيح الاسم
import { WishlistSectionComponent } from './components/wishlist-section/wishlist-section.component'; // تصحيح الاسم
import { SettingsSectionComponent } from './components/settings-section/settings-section.component'; // تصحيح الاسم
import { AchievementsSectionComponent } from './components/achievements-section/achievements-section.component';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';

import { FollowSellerComponent } from './components/follow-seller/follow-seller.component';

const routes: Routes = [
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
      { path: 'wishlist', component: WishlistSectionComponent },
      { path: 'Card', component: CartComponent },
      { path: 'follow-seller', component: FollowSellerComponent }
    ],
  },
  { path: 'products', component: ProductSearchComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
