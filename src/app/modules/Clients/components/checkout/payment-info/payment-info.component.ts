// payment-info.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { OrderCreateViewModel } from '../../../Models/OrderCreateViewModel';

@Component({
  selector: 'app-payment-info',
  standalone: false,
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css'],
})
export class PaymentInfoComponent {
  @Input() checkoutModel: OrderCreateViewModel;
  @Input() currentStep: number = 2;
  @Output() nextStep: EventEmitter<void> = new EventEmitter<void>();
  @Output() previousStep: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    this.checkoutModel = {
      billingData: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        country: '',
        email: '',
        apartment: '',
        floor: '',
        building: '',
        shippingMethod: '',
      },

      paymentType : 0,
      clientId: '',
      orderItems: [],
      totalPrice: 0,
      totalPoints: 0,
      usedPaidPoints: 0,
      usedFreePoints: 0,
      couponCode: '',
      status: 0

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
}
