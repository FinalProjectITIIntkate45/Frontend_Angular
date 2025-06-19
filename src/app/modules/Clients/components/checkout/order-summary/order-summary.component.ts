import { Component, OnInit } from '@angular/core';

import { CartInterface } from '../../../Models/CartInterface';
import { CartServicesService } from '../../../Services/CardServices.service';


@Component({
  selector: 'app-order-summary',
  standalone: false,
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  cartData: CartInterface | null = null;
  isLoading: boolean = true;

  constructor(private cartService: CartServicesService) {}

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
  }
}
