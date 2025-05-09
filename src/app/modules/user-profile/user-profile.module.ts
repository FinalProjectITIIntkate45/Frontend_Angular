import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile.component';
import { ProfileSectionComponent } from './components/profile-section/profile-section.component';
import { WalletSectionComponent } from './components/wallet-section/wallet-section.component';
import { DrdersSectionComponent } from './components/orders-section/orders-section.component';
import { PointsSectionComponent } from './components/points-section/points-section.component';
import { RecyclingSectionComponent } from './components/recycling-section/recycling-section.component';
import { DonationsSectionComponent } from './components/donations-section/donations-section.component';
import { WishlistSectionComponent } from './components/wishlist-section/wishlist-section.component';
import { AchievementsSectionComponent } from './components/Achievements-section/achievements-section.component';
import { SettingsSectionComponent } from './components/settings-section/settings-section.component';
import { SharedModule } from '../../shared/shared.module';
import { UserProfileRoutingModule } from './route/user-profile-routing.module';

@NgModule({
  declarations: [
    UserProfileComponent,
    ProfileSectionComponent,
    WalletSectionComponent,
    DrdersSectionComponent,
    PointsSectionComponent,
    RecyclingSectionComponent,
    DonationsSectionComponent,
    WishlistSectionComponent,
    AchievementsSectionComponent,
    SettingsSectionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    UserProfileRoutingModule,
  ],
  exports: [UserProfileComponent],
})
export class UserProfileModule {}
