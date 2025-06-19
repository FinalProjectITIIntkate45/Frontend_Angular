import { Component, Input, Output, EventEmitter } from '@angular/core';

import { OrderCreateViewModel } from '../../../Models/OrderCreateViewModel';

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

  constructor() {
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
}
