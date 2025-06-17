import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { CheckoutResultVM } from '../../Models/CheckoutResultVM';
import { PaymentType } from '../../Models/CheckoutResultVM';
import { OrderCreateViewModel } from '../../Models/OrderCreateViewModel';
import { CartServicesService } from '../../Services/CardServices.service';
import { CheckoutService } from '../../Services/checkout.service';
import { OrderService } from '../../Services/order.service';
import { APIResponse } from '../../../../core/models/APIResponse';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartData: any;
  isLoading = false;
  error: string | null = null;
  paymentResult: CheckoutResultVM | null = null;
  checkoutModel: OrderCreateViewModel;
  currentStep = 1;
  deliveryMethod: string = 'ship';

  constructor(
    private cartService: CartServicesService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private orderService: OrderService
  ) {
    this.checkoutModel = {
      clientId: '',
      orderItems: [],
      totalPrice: 0,
      totalPoints: 0,
      usedPaidPoints: 0,
      usedFreePoints: 0,
      couponCode: '',
      paymentType: PaymentType.CashOnDelivery,
      billingData: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        city: '',
        country: '',
        state: '',
        apartment: '',
        floor: '',
        street: '',
        building: '',
        shippingMethod: '',
      },
      status: 0,
    };
  }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.isLoading = true;
    this.error = null;

    this.cartService.getCartItems().subscribe({
      next: (data) => {
        this.cartData = data;

        this.checkoutModel.orderItems = this.cartData.Items.map((item: any) => ({
          productId: item.ProductId,
          quantity: item.Quantity,
          price: item.Price,
        }));

        this.checkoutModel.totalPrice = this.cartData.CartTotalPrice;
        this.checkoutModel.totalPoints = this.cartData.CartTotalPoints;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'فشل تحميل عناصر العربة';
        this.isLoading = false;
      },
    });
  }

  selectDeliveryMethod(method: string): void {
    this.deliveryMethod = method;
    if (method === 'ship') {
      this.checkoutModel.billingData.shippingMethod = 'ship';
    } else {
      this.checkoutModel.billingData.shippingMethod = 'pickup';
      this.currentStep = 2;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
    if (this.currentStep === 1) {
      this.checkoutModel.billingData = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        city: '',
        country: '',
        state: '',
        apartment: '',
        floor: '',
        street: '',
        building: '',
        shippingMethod: '',
      };
    }
  }

  // Validation function for the payment section
  isPaymentValid(): boolean {
    return !!this.checkoutModel.paymentType;
  }

  // Function to check if the form is valid
  isFormValid(): boolean {
    if (this.currentStep === 1) {
      return this.isDeliveryValid();
    } else if (this.currentStep === 2) {
      return this.isPaymentValid();
    }

    return true; // For confirmation step
  }

  // Proceed to next step
  nextStep(): void {
    if (this.isFormValid()) {
      if (this.currentStep < 3) {
        this.currentStep++;
      }
    } else {
      this.toastr.error('Please complete the required fields.', 'Error');
    }
  }

  // Validation function for the delivery section
  isDeliveryValid(): boolean {
    return (
      !!this.checkoutModel.billingData.firstName &&
      !!this.checkoutModel.billingData.lastName &&
      !!this.checkoutModel.billingData.phoneNumber &&
      !!this.checkoutModel.billingData.floor &&
      !!this.checkoutModel.billingData.street &&
      !!this.checkoutModel.billingData.city &&
      !!this.checkoutModel.billingData.state &&
      !!this.checkoutModel.billingData.country &&
      !!this.checkoutModel.billingData.email
    );
  }

  // Proceed to checkout
  proceedToCheckout(): void {
    if (this.isFormValid()) {
      this.checkoutService.finalizeCheckout(this.checkoutModel).subscribe({
        next: (result) => {
          if (result.IsSuccess) {
            this.paymentResult = result.Data;
            this.toastr.success('Checkout completed successfully!', 'Success');
          } else {
            this.toastr.error(result.Message, 'Error');
          }
        },
        error: (err) => {
          this.toastr.error('Checkout failed. Please try again later.', 'Error');
        },
      });
    } else {
      this.toastr.error('Please complete the form before proceeding.', 'Error');
    }
  }
}
