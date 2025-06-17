// checkout.component.ts
import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { OrderCreateViewModel } from '../../Models/OrderCreateViewModel';
import { CheckoutService } from '../../Services/checkout.service';

import { DeliveryInfoComponent } from "./delivery-info/delivery-info.component";
import { OrderConfirmationComponent } from "./order-confirmation/order-confirmation.component";
import { PaymentInfoComponent } from "./payment-info/payment-info.component";

@Component({
  selector: 'app-checkout',
  standalone: false ,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],


})
export class CheckoutComponent implements OnInit {
  checkoutModel: OrderCreateViewModel;
  currentStep: number = 1;
  // add current step as emmiter
  


  constructor(
    private checkoutService: CheckoutService,
    private toastr: ToastrService
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

  ngOnInit(): void {}

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onPlaceOrder() {
    // Execute place order logic here
  }
}
