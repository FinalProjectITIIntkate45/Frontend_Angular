import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RecyclingRoutingModule } from './recycling-routing.module';
import { RecyclerDashboardComponent } from './Components/recycler-dashboard/recycler-dashboard.component';
import { AuctionsListComponent } from './Components/auctions-list/auctions-list.component';
import { WalletDisplayComponent } from './Components/wallet-display/wallet-display.component';

// Services
import { AuctionService } from './Services/auction.service';
import { WalletService } from './Services/wallet.service';

@NgModule({
  declarations: [
    RecyclerDashboardComponent,
    AuctionsListComponent,
    WalletDisplayComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RecyclingRoutingModule,
    
  ],
  providers: [
    AuctionService,
    WalletService,
  ],
})
export class RecyclingModule {} 