import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FaqComponent } from "./components/faq/faq.component";
import { HeaderComponent } from "./components/header/header.component";
import { HeroComponent } from "./components/hero/hero.component";
import { FeaturesComponent } from "./components/features/features.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AboutComponent } from "./components/About/About.component";
import { TopRatedComponent } from './components/Top-Rated/Top-Rated.component';
import { BestSellerComponent } from './components/Best-Seller/Best-Seller.component';
import { NewOffersComponent } from './components/New-Offers/New-Offers.component';
import { BestShopComponent } from "./components/Best-shop/Best-shop.component";

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    HeroComponent,
    FeaturesComponent,
    FooterComponent,
    AboutComponent,
    BestSellerComponent,
    NewOffersComponent,
    BestShopComponent,
    TopRatedComponent,
    FaqComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  exports: [
    HomeComponent,
    HeaderComponent,
    HeroComponent,
    FeaturesComponent,
    FooterComponent,
    AboutComponent,
    BestSellerComponent,
    NewOffersComponent,
    BestShopComponent,
    TopRatedComponent,
    FaqComponent
  ]
})
export class HomeModule { }
