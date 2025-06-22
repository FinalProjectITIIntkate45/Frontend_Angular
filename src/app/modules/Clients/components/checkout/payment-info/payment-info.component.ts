import { Component, Input, Output, EventEmitter } from '@angular/core';

import { OrderCreateViewModel } from '../../../Models/OrderCreateViewModel';
import { CheckoutService } from '../../../Services/checkout.service';

@Component({
  selector: 'app-payment-info',
  standalone: false ,
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css'],
})
export class PaymentInfoComponent {
  @Input() checkoutModel: OrderCreateViewModel;
  @Input() currentStep: number = 2;
  @Output() nextStep: EventEmitter<void> = new EventEmitter<void>();
  @Output() previousStep: EventEmitter<void> = new EventEmitter<void>();
  couponCode: string = '';
couponMessage: string | null = null;
couponValid: boolean = false;


  constructor(private checkoutService: CheckoutService) {
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
  isPaymentValid(): boolean {
    return !!this.checkoutModel.paymentType;
  }

  onNextStep(): void {
    if (this.isPaymentValid()) {
      this.nextStep.emit();
    }
  }

  onPreviousStep(): void {
    this.previousStep.emit();  // Emit event to go to previous step
  }
  applyCoupon(): void {
  if (!this.couponCode.trim()) {
    this.couponMessage = 'Please enter a coupon code.';
    this.couponValid = false;
    return;
  }

  this.checkoutModel.couponCode = this.couponCode.trim()  ;

  this.checkoutService.validateCoupon(this.checkoutModel).subscribe({
    next: (res) => {
      if (res.IsSuccess && res.Data) {
        this.couponMessage = '🎉 Coupon applied successfully!';
        this.couponValid = true;

        // لو حابب تحدث السعر النهائي هنا
        this.checkoutModel.totalPrice -= res.Data.discount;

      } else {
        this.couponMessage = '❌ Invalid or inapplicable coupon.';
        this.couponValid = false;
      }
    },
    error: () => {
      this.couponMessage = '⚠️ Error validating coupon.';
      this.couponValid = false;
    }
  });
}
  resetCoupon(): void {
    this.couponCode = '';
    this.couponMessage = null;
    this.couponValid = false;
    this.checkoutModel.couponCode = '';
  }
}
