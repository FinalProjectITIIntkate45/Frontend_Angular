import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserProfileComponent } from '../.././modules/Clients/components/user-profile/user-profile.component';
import { ProfileSectionComponent } from '../.././modules/Clients/components/profile-section/profile-section.component';
import { WalletSectionComponent } from '../.././modules/Clients/components/wallet-section/wallet-section.component';
import { DrdersSectionComponent } from '../.././modules/Clients/components/orders-section/orders-section.component';
import { PointsSectionComponent } from '../.././modules/Clients/components/points-section/points-section.component';
import { RecyclingSectionComponent } from '../.././modules/Clients/components/recycling-section/recycling-section.component';
import { DonationsSectionComponent } from '../.././modules/Clients/components/donations-section/donations-section.component';
import { WishlistSectionComponent } from '../.././modules/Clients/components/wishlist-section/wishlist-section.component';
import { AchievementsSectionComponent } from '../.././modules/Clients/components/achievements-section/achievements-section.component';
import { SettingsSectionComponent } from '../.././modules/Clients/components/settings-section/settings-section.component';
import { SharedModule } from '../../shared/shared.module';
import { ClientRoutingModule } from '../.././modules/Clients/client-routing.module';

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
    ClientRoutingModule,
    FormsModule,
  ],
  exports: [UserProfileComponent],
})
export class UserProfileModule {}
