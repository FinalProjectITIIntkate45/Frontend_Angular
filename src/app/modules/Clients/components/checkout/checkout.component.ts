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
      couponCode: { code: '' },
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

    console.log('✅ Step:', this.currentStep);
    console.log('🚚 Delivery Method:', this.deliveryMethod);
    console.log('📦 BillingData:', this.checkoutModel.billingData);

  }

  loadCartData(): void {
    this.isLoading = true;
    this.error = null;

    this.cartService.getCartItems().subscribe(
      (cartItems) => {
        this.checkoutModel.orderItems = cartItems.Items.filter(
          (item: CartItemInterface) => item.productVM !== undefined
        ).map((item: CartItemInterface) => ({
          productId: item.productVM!.Id,
          quantity: 1,
          price: item.productVM!.DisplayedPrice,
          points: item.productVM!.Points,
        }));

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
    if (this.checkoutModel.billingData) {
      this.checkoutModel.billingData.shippingMethod = method;
    }
    this.currentStep = method === 'pickup' ? 2 : 1;
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

    if (this.checkoutModel.billingData?.shippingMethod?.toLowerCase() === 'pickup') {
      this.checkoutModel.billingData = null;
    }

    if (!this.checkoutModel.paymentType) {
      this.toastr.error('Please select a payment method', 'Error');
      return;
    }

    this.isLoading = true;

    this.checkoutService.finalizeCheckout(this.checkoutModel).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.IsSuccess && res.Data) {
          const result = res.Data;

          const confirmed = confirm(
            `✅ Final Amount: ${result.finalAmount} EGP\n🎯 Earned Points: ${result.earnedPoints}\n\nDo you want to confirm the order?`
          );

          if (!confirmed) return;

          if (result.paymentUrl) {
            window.location.href = result.paymentUrl;
            return;
          }

          this.toastr.success('Order placed successfully!', 'Success');

          this.cartService.clearCart().subscribe(
            () => {
              this.toastr.success('Cart cleared after order');
              this.resetCheckout();
            },
            (error) => {
              console.error('Error clearing cart:', error);
              this.toastr.warning('Order placed but cart not cleared', 'Warning');
            }
          );
        } else {
          this.toastr.error(res.Message || '❌ Failed to finalize checkout');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ Error finalizing checkout:', error);
        this.toastr.error('⚠️ Error finalizing checkout');
      },
    });
  }

  resetCheckout(): void {
    this.checkoutModel = {
      clientId: '',
      orderItems: [],
      totalPrice: 0,
      totalPoints: 0,
      usedPaidPoints: 0,
      usedFreePoints: 0,
      couponCode: { code: '' },
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
  }
}
