import { Component, Input, Output, EventEmitter } from '@angular/core';

import { PaymentType } from '../../../Models/CheckoutResultVM';
import { OrderCreateViewModel } from '../../../Models/OrderCreateViewModel';
import { CheckoutService } from '../../../Services/checkout.service';

@Component({
  selector: 'app-payment-info',
  standalone: false,
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css'],
})
export class PaymentInfoComponent {
  @Input() checkoutModel!: OrderCreateViewModel;
  @Input() currentStep: number = 2;
  @Output() nextStep: EventEmitter<void> = new EventEmitter<void>();
  @Output() previousStep: EventEmitter<void> = new EventEmitter<void>();

  couponCode: { code: 'DISCOUNT50' } = { code: 'DISCOUNT50' };
  couponMessage: string | null = null;
  couponValid: boolean = false;

  // ✅ ده اللي بيحل المشكلة
  PaymentType = PaymentType;

  constructor(private checkoutService: CheckoutService) {}

  // Method to handle payment type selection
  onPaymentTypeChange(paymentType: PaymentType): void {
    this.checkoutModel.paymentType = paymentType;
  }

  isPaymentValid(): boolean {
    // Check if payment type is selected
    if (
      this.checkoutModel.paymentType === undefined ||
      this.checkoutModel.paymentType === null
    ) {
      return false;
    }

    // Convert to number if it's a string (radio buttons sometimes return strings)
    const paymentTypeValue = Number(this.checkoutModel.paymentType);

    // Validate payment type using switch case
    switch (paymentTypeValue) {
      case PaymentType.PointsOnly:
      case PaymentType.CashCollection:
      case PaymentType.AcceptKiosk:
      case PaymentType.MobileWallet:
      case PaymentType.PayPal:
      case PaymentType.OnlineCard:
      case PaymentType.Paymob:
      case PaymentType.CashOnDelivery:
        return true;
      default:
        return false;
    }
  }

  onNextStep(): void {
    if (this.isPaymentValid()) {
      this.nextStep.emit();
    }
  }

  onPreviousStep(): void {
    this.previousStep.emit();
  }

  applyCoupon(): void {
    if (!this.couponCode.code.trim()) {
      this.couponMessage = 'Please enter a coupon code.';
      this.couponValid = false;
      return;
    }

    this.checkoutModel.couponCode = { code: this.couponCode.code.trim() };

    this.checkoutService.validateCoupon(this.checkoutModel).subscribe({
      next: (res) => {
        if (res.IsSuccess && res.Data) {
          this.couponMessage = '🎉 Coupon applied successfully!';
          this.couponValid = true;
          this.checkoutModel.totalPrice -= res.Data.discount;
        } else {
          this.couponMessage = '❌ Invalid or inapplicable coupon.';
          this.couponValid = false;
        }
      },
      error: () => {
        this.couponMessage = '⚠️ Error validating coupon.';
        this.couponValid = false;
      },
    });
  }

  resetCoupon(): void {
    this.checkoutModel.totalPrice = this.checkoutModel.totalPrice; // Reset to original price
    this.couponMessage = null;
    this.couponValid = false;
    this.checkoutModel.couponCode = null;
  }
}
