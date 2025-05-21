import { Component, OnInit } from '@angular/core';
import { CartItemInterface } from '../../models/CartItemInterface';
import { CardServicesService } from '../../Services/CardServices.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
   imports: [CommonModule],
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems : CartItemInterface [] = [];

  totalprice : number = 0;

  constructor(private CardServices : CardServicesService) { }

ngOnInit(): void {
    const clientId = 'user123'; 
    this.CardServices.GetCardItems(clientId).subscribe(data => {
      this.cartItems = data;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.totalprice = this.cartItems.reduce((sum, item) => {
      return sum + item.product.displayedPriceAfterDiscount * item.quantity;
    }, 0);
  }

  removeItem(cartItemId: number): void {
    this.CardServices.removeFromCart(cartItemId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);
      this.calculateTotal();
    });
    }

}
