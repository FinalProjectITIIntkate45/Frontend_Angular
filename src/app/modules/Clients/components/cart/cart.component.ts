import { Component, OnInit } from '@angular/core';
import { CartServicesService } from '../../Services/CardServices.service';
import { CartItemInterface } from '../../Models/CartItemInterface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: CartItemInterface[] = [];
  isLoading = false;
  error: string | null = null;
  clientId = 'your-client-id'; // This should come from authentication service

  constructor(private cartService: CartServicesService) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  // Load cart items from server
  loadCartItems(): void {
    this.isLoading = true;
    this.error = null;

    this.cartService.getCartItems(this.clientId).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load cart items';
        this.isLoading = false;
        console.error('Error loading cart items:', error);
      }
    });
  }

  // Remove item from cart
  removeItem(cartItemId: number): void {
    this.cartService.removeFromCart(cartItemId).subscribe({
      next: () => {
        // Remove item from local array
        this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);
      },
      error: (error) => {
        this.error = 'Failed to remove item';
        console.error('Error removing item:', error);
      }
    });
  }

  // Clear entire cart
  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart(this.clientId).subscribe({
        next: () => {
          this.cartItems = [];
        },
        error: (error) => {
          this.error = 'Failed to clear cart';
          console.error('Error clearing cart:', error);
        }
      });
    }
  }

  // Calculate total price
  get totalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.quantity * item.product.displayedPriceAfterDiscount);
    }, 0);
  }

  // Update item quantity (optional feature)
  updateQuantity(cartItemId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(cartItemId);
      return;
    }

    this.cartService.updateCartItemQuantity(cartItemId, newQuantity).subscribe({
      next: () => {
        // Update local array
        const item = this.cartItems.find(i => i.id === cartItemId);
        if (item) {
          item.quantity = newQuantity;
        }
      },
      error: (error) => {
        this.error = 'Failed to update quantity';
        console.error('Error updating quantity:', error);
      }
    });
  }
}
