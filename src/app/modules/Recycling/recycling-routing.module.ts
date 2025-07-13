import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecyclerDashboardComponent } from './Components/recycler-dashboard/recycler-dashboard.component';
import { AuctionListComponent } from './Components/GetAllAuctions/GetAllAuctions';
import { AuctionDetailComponent } from './Components/auction-detail/auction-detail.component';
import { NotificationComponent } from './Components/notification/notification.component';
import { AuctionRoomComponent } from './Components/auction-room/auction-room.component';
import { ActiveAuctionsComponent } from './Components/get-active-auctions/active-auctions.component';
import { RecyclerRequestsComponent } from './Components/recycler-requests/recycler-requests.component';
import { WalletDisplayComponent } from './Components/wallet-display/wallet-display.component';
import { AuctionsWinnerComponent } from './Components/auctions-winner/auctions-winner.component';

const routes: Routes = [
  {
    path: '',
    component: RecyclerDashboardComponent,
  },
  {
    path: 'get-all-auctions',
    component: AuctionListComponent,
  },
  {
    path: 'auction-list',
    component: AuctionListComponent,
  },
  {
    path: 'active-auctions',
    component: ActiveAuctionsComponent,
  },
  {
    path: 'auction-detail/:id',
    component: AuctionDetailComponent,
  },
  {
    path: 'room/:id',
    component: AuctionRoomComponent,
  },
  {
    path: 'notification',
    component: NotificationComponent,
  },
  {
    path: 'recycler-requests',
    component: RecyclerRequestsComponent,
  },
  {
    path: 'wallet',
    component: WalletDisplayComponent,
  },
  {
    path: 'paginated-auctions',
    loadComponent: () => import('./paginated-auctions/paginated-auctions.component').then(m => m.PaginatedAuctionsComponent)
  },
  {
    path : 'win-auctions',
    component : AuctionsWinnerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecyclingRoutingModule { }