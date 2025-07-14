import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecyclingRoutingModule } from './recycling-routing.module';

// Components
import { NotificationComponent } from './Components/notification/notification.component';
import { RecyclerDashboardComponent } from './Components/recycler-dashboard/recycler-dashboard.component';
import { AuctionDetailComponent } from './Components/auction-detail/auction-detail.component';
import { AuctionListComponent } from './Components/GetAllAuctions/GetAllAuctions';
import { AuctionRoomComponent } from './Components/auction-room/auction-room.component';
import { ActiveAuctionsComponent } from './Components/get-active-auctions/active-auctions.component';
import { RecyclerRequestsComponent } from './Components/recycler-requests/recycler-requests.component';
import { WalletDisplayComponent } from './Components/wallet-display/wallet-display.component';
import { WalletRechargeComponent } from './Components/wallet-recharge/wallet-recharge.component';
import { WalletSectionComponent } from './Components/wallet-section/wallet-section.component';
import { WalletSuccessComponent } from './Components/wallet-success/wallet-success.component';

// Shared Components
import { RecyclerNavbarComponent } from './Components/Share/RecyclerNavbar/RecyclerNavbar.component';
import { RecyclerSideBarComponent } from './Components/Share/RecyclerSideBar/RecyclerSideBar.component';
import { RecyclerLayoutComponent } from './Components/Share/RecyclerLayout/RecyclerLayout.component';
import { RecyclerDemoComponent } from './Components/Share/RecyclerDemo/RecyclerDemo.component';

// Services
import { RecyclerService } from './Services/recycler.service';
import { AuctionService } from './Services/auction.service';
import { AuctionRequestService } from './Services/auction-request.service';
import { RecyclerRequestService } from './Services/RecyclerRequest.service';
import { NotificationService } from './Services/notification.service.service';
import { ApiNotificationService } from './Services/api-notification.service';
import { ActiveAuctionsService } from './Services/active-auctions.service';
import { AuctionBidService } from './Services/auction-bid.service';
import { AuctionBidSignalrService } from './Services/auction-bid-signalr.service';
import { AuctionsWinnerComponent } from './Components/auctions-winner/auctions-winner.component';

@NgModule({
  declarations: [
    // Main Components
    AuctionListComponent,
    AuctionDetailComponent,
    AuctionRoomComponent,
    NotificationComponent,
    RecyclerDashboardComponent,
    ActiveAuctionsComponent,
    RecyclerRequestsComponent,
    WalletDisplayComponent,
    WalletRechargeComponent,
    WalletSectionComponent,
    WalletSuccessComponent,
    AuctionsWinnerComponent,
    // Shared Components
    RecyclerNavbarComponent,
    RecyclerSideBarComponent,
    RecyclerLayoutComponent,
    RecyclerDemoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RecyclingRoutingModule
  ],
  providers: [
    // Services
    RecyclerService,
    AuctionService,
    AuctionRequestService,
    RecyclerRequestService,
    NotificationService,
    ApiNotificationService,
    ActiveAuctionsService,
    AuctionBidService,
    AuctionBidSignalrService
  ],
  exports: [
    // Export shared components if needed by other modules
    RecyclerLayoutComponent,
    RecyclerNavbarComponent,
    RecyclerSideBarComponent
  ]
})
export class RecyclingModule {}