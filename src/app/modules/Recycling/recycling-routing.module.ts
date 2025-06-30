import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecyclerDashboardComponent } from './Components/recycler-dashboard/recycler-dashboard.component';
import { AuctionsListComponent } from './Components/auctions-list/auctions-list.component';
import { WalletDisplayComponent } from './Components/wallet-display/wallet-display.component';

const routes: Routes = [
  {
    path: '',
    component: RecyclerDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: RecyclerDashboardComponent },
      { path: 'auctions', component: AuctionsListComponent },
      { path: 'wallet', component: WalletDisplayComponent },
    ]
  },
  {
    path: 'AuctionRequest',
    component: AuctionsListComponent,
  },
  {
    path: 'wallet',
    component: WalletDisplayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecyclingRoutingModule {} 