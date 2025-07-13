import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { OfferListComponent } from '../Clients/components/offer/offer-list/offer-list.component';
import { OfferDetailesComponent } from '../Providers/Components/OfferGroupe/OfferDetailes/OfferDetailes.component';
import { CharityDetailsComponent } from '../Clients/components/charity/charity-details/charity-details.component';
import { DonateComponent } from '../Clients/components/charity/donate/donate.component';
import { CharityListComponent } from '../Clients/components/charity/charity-list/charity-list.component';
import { ShopsSectionComponent } from '../Clients/components/Shop-section/shops-section.component';
import { AboutComponent } from './components/About/About.component';
import { ProductSearchComponent } from '../Clients/components/product-search/product-search.component';
import { ProductDetailsComponent } from '../Clients/components/product-details/product-details.component';
import { AboutUsComponent } from '../Clients/components/about-us/about-us.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'offers', component: OfferListComponent },
  { path: 'offers/:id', component: OfferDetailesComponent },
  { path: 'charity-details/:id', component: CharityDetailsComponent },
  { path: 'donate/:id', component: DonateComponent },
  { path: 'charities', component: CharityListComponent },
  { path: 'shop', component: ShopsSectionComponent },
  { path: 'about-us', component: AboutUsComponent },
  {
    path: 'products',
    children: [
      { path: '', component: ProductSearchComponent },
      { path: ':id', component: ProductDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
