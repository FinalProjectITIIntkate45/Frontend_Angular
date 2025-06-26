import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { CartInterface } from '../../Models/CartInterface';
import { CartServicesService } from '../../Services/CardServices.service';

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

  constructor(private cartService: CartServicesService ,
    private router: Router,
    private toster : ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.isLoading = true;
    this.error = null;

    this.cartService.getCartItems().subscribe({
      next: (data: CartInterface) => {
        // Use new backend fields if present
        if (typeof data.price1 === 'number' && typeof data.price2 === 'number') {
          data.CartTotalPrice = data.price1 + data.price2;
        }
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

  removeItem(itemId?: number, isOffer: boolean = false): void {
    if (itemId == null) return;
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        this.toster.success('Item removed from cart.');
        this.loadCartItems();
      },
      error: (error) => {
        this.toster.error('Failed to remove item from cart.');
        console.error('Error removing item:', error);
      }
    });
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartData = { Items: [], CartTotalPrice: 0, CartTotalPoints: 0 };
    }
  }

  recalculateTotals(): void {
    if (!this.cartData) return;
    // Use new backend fields if present
    if (typeof this.cartData.price1 === 'number' && typeof this.cartData.price2 === 'number') {
      this.cartData.CartTotalPrice = this.cartData.price1 + this.cartData.price2;
    } else {
      let total = 0;
      let points = 0;
      this.cartData.Items.forEach(item => {
        total += item.offer ? item.offer.NewPrice : (item.productVM?.DisplayedPrice ?? 0);
        points += item.offer ? item.offer.NewPoints : (item.productVM?.Points ?? 0);
      });
      this.cartData.CartTotalPrice = total;
      this.cartData.CartTotalPoints = points;
    }
  }

  // proceedToCheckout to  navigate to checkout
  proceedToCheckout(): void {

    if (this.cartData && this.cartData.Items.length > 0) {
      // Navigate to checkout
      this.router.navigate(['/client/checkout']);
      this.toster.success('You are now ready to checkout.', 'Success');
    } else {
      this.toster.error('Your cart is empty. Please add items to your cart before proceeding to checkout.', 'Error');
    }
  }
}
