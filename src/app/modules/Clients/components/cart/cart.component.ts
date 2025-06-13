import { Component, OnInit } from '@angular/core';
import { CartServicesService } from '../../Services/CardServices.service';
import { CartInterface } from '../../Models/CartInterface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: false,
})
export class CartComponent implements OnInit {
  cartData: CartInterface | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private cartService: CartServicesService) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.isLoading = true;
    this.error = null;

    this.cartService.getCartItems().subscribe({
      next: (data: CartInterface) => {
        this.cartData = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load cart items';
        this.isLoading = false;
        console.error('Error loading cart items:', error);
      }
    });
  }

  removeItem(productName: string): void {
    // This assumes productName is unique — change to an ID if you have one.
    this.cartData!.Items = this.cartData!.Items.filter(item => item.ProductName !== productName);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartData = { Items: [], CartTotalPrice: 0, CartTotalPoints: 0 };
    }
  }

  updateQuantity(productName: string, newQuantity: number): void {
    const item = this.cartData?.Items.find(i => i.ProductName === productName);
    if (item && newQuantity > 0) {
      item.Quantity = newQuantity;
      item.TotalPrice = item.Price * newQuantity;
      item.Totalpoints = item.points * newQuantity;
      this.recalculateTotals();
    } else if (item && newQuantity <= 0) {
      this.removeItem(productName);
    }
  }

  recalculateTotals(): void {
    if (!this.cartData) return;

    let total = 0;
    let points = 0;

    this.cartData.Items.forEach(item => {
      total += item.TotalPrice;
      points += item.Totalpoints;
    });

    this.cartData.CartTotalPrice = total;
    this.cartData.CartTotalPoints = points;
  }
}
