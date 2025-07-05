import { Component, Input, OnInit } from '@angular/core';

import { CartInterface } from '../../../Models/CartInterface';
import { OrderCreateViewModel } from '../../../Models/OrderCreateViewModel';
import { CartServicesService } from '../../../Services/CardServices.service';
import { Point } from '../../../../../core/models/point.model';
import { AuthService } from '../../../../../core/services/Auth.service';
import { WalletService } from '../../../../../core/services/wallet.service';

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
              private authService: AuthService) {

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
    this.authService.getUserID().subscribe(userId => {
    this.walletService.getShopPoints().subscribe(points => {
      this.shopPoints = points;
      this.totalShopPoints = points.reduce((sum, p) => sum + p.points, 0);
    });

    this.walletService.getFreePoints().subscribe(points => {
      this.freePoints = points;
      this.totalFreePoints = points.reduce((sum, p) => sum + p.points, 0);
    });
    this.totalPoints = this.totalShopPoints + this.totalFreePoints;
  });

  }
}
