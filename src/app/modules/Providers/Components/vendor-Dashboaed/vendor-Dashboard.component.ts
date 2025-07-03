import { Component } from '@angular/core';
import { ChartContainerComponent } from '../chart-container/chart-container.component';
import { HeaderComponent } from '../header/header.component';
import { WelcomeBannerComponent } from '../welcome-banner/welcome-banner.component';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { SalesOverviewComponent } from '../sales-overview/sales-overview.component';
import { NotificationsPanelComponent } from '../notifications-panel/notifications-panel.component';
import { OrdersTableComponent } from '../orders-table/orders-table.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProviderLayoutComponent } from '../provider-layout/provider-layout.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProviderRoutingModule } from '../../provider-routing.module';
import { SafeUrlPipe } from '../../Services/SafeUrl.pipe';
import { ProviderModule } from "../../provider.module";
import { AddShopComponent } from '../add-shop/add-shop.component';
import { EditShopComponent } from '../edit-shop/edit-shop.component';
import { ProductDetailsPageComponent } from '../product-details-page/product-details-page.component';
import { ProductFormPageComponent } from '../product-form-page/product-form-page.component';
import { ProductListPageComponent } from '../product-list-page/product-list-page.component';
import { ProviderOrdersComponent } from '../provider-orders/provider-orders.component';
import { SubScrptionComponent } from '../SubScrption/SubScrption.component';


@Component({
  selector: 'app-vendor-Dashboard',
  templateUrl: './vendor-Dashboard.component.html',
  styleUrls: ['./vendor-Dashboard.component.css'],
  standalone: false,
})
export class VendorDashboardComponent {
isWelcomeBannerAvailable: any;
isHeaderAvailable: any;
  constructor() { }
}
@NgModule({
  declarations: [
  VendorDashboardComponent,


  // ...other components
],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProviderRoutingModule,
    SafeUrlPipe,
    
],
  exports: [
    VendorDashboardComponent,

  ],
})
export class VendorDashboardModule {}
