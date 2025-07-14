import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FaqComponent } from './components/faq/faq.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutComponent } from './components/About/About.component';
import { TopRatedComponent } from './components/Top-Rated/Top-Rated.component';
import { BestSellerComponent } from './components/Best-Seller/Best-Seller.component';
import { NewOffersComponent } from './components/New-Offers/New-Offers.component';
import { BestShopComponent } from './components/Best-shop/Best-shop.component';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { ProductSearchComponent } from '../Clients/components/product-search/product-search.component';
import { ProductDetailsComponent } from '../Clients/components/product-details/product-details.component';

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
    FaqComponent,
    HomeLayoutComponent,
    ProductSearchComponent,
    ProductDetailsComponent,
  ],
  imports: [CommonModule, HomeRoutingModule, FormsModule],
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
    FaqComponent,
  ],
})
export class HomeModule {}
