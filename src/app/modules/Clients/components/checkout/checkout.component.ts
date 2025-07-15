import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { CartItemInterface } from '../../Models/CartItemInterface';
import { OrderCreateViewModel } from '../../Models/OrderCreateViewModel';
import { CartServicesService } from '../../Services/CardServices.service';
import { CheckoutService } from '../../Services/checkout.service';
import { AuthService } from '../../../../core/services/Auth.service';
import { Router } from '@angular/router';

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
    private authService: AuthService,
    private router: Router
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
    this.authService.getUserID().subscribe((userId) => {
      this.checkoutModel.clientId = userId;
    });
    this.loadCartData();
  }

  loadCartData(): void {
    this.isLoading = true;
    this.error = null;
    this.cartService.getCartItems().subscribe(
      (cartItems) => {
        this.checkoutModel.orderItems = cartItems.Items.filter(
          (item: CartItemInterface) =>
            item.productVM !== undefined && item.qty !== undefined
        ).map((item: CartItemInterface) => ({
          ProductId: item.productVM!.Id,
          Quantity: item.qty as number,
          ProductName: item.productVM!.Name,
          ShopName: item.productVM!.ShopName,
          Description: item.productVM!.Description,
          Price: item.productVM!.DisplayedPrice,
          PriceAfterDiscount: item.productVM!.DisplayedPriceAfterDiscount || 0,
          Image: item.productVM!.Images[0] || '',
          Points: item.productVM!.Points,
        }));
        this.checkoutModel.totalPrice = cartItems.price;
        this.checkoutModel.totalPoints = cartItems.CartTotalPoints;
        this.isLoading = false;
      },
      (error) => {
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
    if (this.checkoutModel.orderItems.length === 0) {
      this.toastr.error('Your cart is empty!', 'Error');
      return;
    }
    if (
      this.checkoutModel.billingData?.shippingMethod?.toLowerCase() === 'pickup'
    ) {
      this.checkoutModel.billingData = null;
    }
    if (
      this.checkoutModel.paymentType === undefined ||
      this.checkoutModel.paymentType === null
    ) {
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
            `✅ Final Amount: ${result.FinalAmount} EGP\n\n🎯 Earned Points: ${result.EarnedPoints} \n🎯 Used Points: ${result.UsedFreePoints} \n🎯 Used Paid Points: ${result.UsedPaidPoints}\n\nDo you want to confirm the order?`
          );
          if (!confirmed) return;
          if (result.PaymentUrl) {
            window.location.href = result.PaymentUrl;
            return;
          }
          this.toastr.success('Order placed successfully!', 'Success');
          this.cartService.clearCart().subscribe(
            () => {
              this.toastr.success('Cart cleared after order');
              this.resetCheckout();
              this.router.navigate(['/client/orders']);
            },
            (error) => {
              this.toastr.warning(
                'Order placed but cart not cleared',
                'Warning'
              );
              this.router.navigate(['/client/orders']);
            }
          );
        } else {
          this.toastr.error(res.Message || '❌ Failed to finalize checkout');
        }
      },
      error: (error) => {
        this.isLoading = false;
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
