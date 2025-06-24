import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { CartItemInterface } from '../../Models/CartItemInterface';
import { OrderCreateViewModel } from '../../Models/OrderCreateViewModel';
import { CartServicesService } from '../../Services/CardServices.service';
import { CheckoutService } from '../../Services/checkout.service';
import { AuthService } from '../../../../core/services/Auth.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutModel: OrderCreateViewModel;
  currentStep: number = 1;
  deliveryMethod: string = 'ship';
  isLoading: boolean = false;
  error: string | null = null;
  originalTotalPrice: number = 0;
  shopName: string = '';

  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartServicesService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.checkoutModel = {
      clientId: '',
      orderItems: [],
      totalPrice: 0,
      totalPoints: 0,
      usedPaidPoints: 0,
      usedFreePoints: 0,
      couponCode: '',
      paymentType: 0,
      billingData: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        apartment: '',
        floor: '',
        building: '',
        country: '',
        shippingMethod: '',
        email: '',
      },
      status: 0,
    };
  }

  ngOnInit(): void {
    this.checkoutModel.clientId = this.authService.getUserId();

    this.loadCartData();
  }

  loadCartData(): void {
    this.isLoading = true;
    this.error = null;

  this.cartService.getCartItems().subscribe(
    (cartItems) => {
      // تحويل CartItemInterface إلى OrderItemViewModel
      this.checkoutModel.orderItems = cartItems.Items
        .filter((item: CartItemInterface) => item.productVM !== undefined)
        .map((item: CartItemInterface) => ({
          productId: item.productVM!.Id,
          quantity: 1,
          price: item.productVM!.DisplayedPrice,
          points: item.productVM!.Points
        }));

      // تحديث باقي القيم في checkoutModel
      this.checkoutModel.totalPrice = cartItems.CartTotalPrice;
      this.checkoutModel.totalPoints = cartItems.CartTotalPoints;

        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading cart data:', error);
        this.isLoading = false;
        this.toastr.error('Error loading cart data', 'Error');
      }
    );
  }

  selectDeliveryMethod(method: string): void {
    this.deliveryMethod = method;
    if (method === 'pickup') {
      this.checkoutModel.billingData.shippingMethod = 'pickup';
      this.currentStep = 2;
    } else {
      this.checkoutModel.billingData.shippingMethod = 'ship';
      this.currentStep = 1;
    }
  }

  resetTotalPrice(): void {
    this.checkoutModel.totalPrice = this.originalTotalPrice;
  }

  nextStep(): void {
    if (this.currentStep < 3) this.currentStep++;
  }

  previousStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  onPlaceOrder(): void {
    console.log('📦 Submitting order:', this.checkoutModel);
    if (this.checkoutModel.orderItems.length === 0) {
      this.toastr.error('Your cart is empty!', 'Error');
      return;
    }
    this.checkoutModel.clientId = this.authService.getUserId();
    this.checkoutService.createOrder(this.checkoutModel).subscribe(
      (response) => {
        this.toastr.success('Order placed successfully!', 'Success');

        this.cartService.clearCart().subscribe(
          () => {
            this.toastr.success('Cart cleared after order');

            this.checkoutModel = {
              clientId: '',
              orderItems: [],
              totalPrice: 0,
              totalPoints: 0,
              usedPaidPoints: 0,
              usedFreePoints: 0,
              couponCode: '',
              paymentType: 0,
              billingData: {
                firstName: '',
                lastName: '',
                phoneNumber: '',
                street: '',
                city: '',
                state: '',
                apartment: '',
                floor: '',
                building: '',
                country: '',
                shippingMethod: '',
                email: '',
              },
              status: 0,
            };
            this.currentStep = 1;
          },
          (error) => {
            console.error('Error clearing cart:', error);
            this.toastr.warning('Order placed but cart not cleared', 'Warning');
          }
        );
      },
      (error) => {
        console.error('Error placing order:', error);
        this.toastr.error('Failed to place order', 'Error');
      }
    );
  }
}
