import { Component, Input, OnInit } from '@angular/core';

import { CartInterface } from '../../../Models/CartInterface';
import { OrderCreateViewModel } from '../../../Models/OrderCreateViewModel';
import { CartServicesService } from '../../../Services/CardServices.service';
import { Point } from '../../../../../core/models/point.model';
import { WalletService } from '../../../../../core/services/wallet.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-order-summary',
  standalone: false,
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  cartData: CartInterface | null = null;
  isLoading: boolean = true;
  totalPoints: number = 0;
  shopPoints: Point[] = [];
  freePoints: Point[] = [];
  totalShopPoints: number = 0;
  totalFreePoints: number = 0;


  @Input() checkoutModel!: OrderCreateViewModel;
  @Input() shopName?: string;

  constructor(private cartService: CartServicesService ,
              private walletService: WalletService,
              ) {

  }

 ngOnInit(): void {
  this.cartService.getCartItems().subscribe({
    next: (data) => {
      this.cartData = data;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading cart data:', err);
      this.isLoading = false;
    }
  });

  forkJoin({
    shop: this.walletService.getShopPoints(),
    free: this.walletService.getFreePoints()
  }).subscribe(({ shop, free }) => {
    this.shopPoints = shop;
    this.freePoints = free;

    this.totalShopPoints = shop.reduce((sum, p) => sum + p.Points, 0);
    this.totalFreePoints = free.reduce((sum, p) => sum + p.Points, 0);
    this.totalPoints = this.totalShopPoints + this.totalFreePoints;
  });
}

// ⬇️ تابع لحساب الإجمالي من الاثنين
updateTotalPoints() {
  this.totalPoints = this.totalShopPoints + this.totalFreePoints;
}



}
