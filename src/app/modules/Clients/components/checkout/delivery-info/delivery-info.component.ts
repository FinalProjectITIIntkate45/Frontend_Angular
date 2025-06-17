import { Component, Input, Output, EventEmitter } from '@angular/core';

import { OrderCreateViewModel } from '../../../Models/OrderCreateViewModel';

@Component({
  selector: 'app-delivery-info',
  standalone: false,
  templateUrl: './delivery-info.component.html',
  styleUrls: ['./delivery-info.component.css'],
})
export class DeliveryInfoComponent {
  @Input() checkoutModel: OrderCreateViewModel;
  @Input() currentStep: number = 1;
  @Output() nextStep: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    this.checkoutModel = {
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
      clientId: '',
      orderItems: [],
      totalPrice: 0,
      totalPoints: 0,
      usedPaidPoints: 0,
      usedFreePoints: 0,
      couponCode: '',
      paymentType: 0,
      status: 0,
    };
  }

  // Function to check if delivery form is valid
  isDeliveryValid(): boolean {
    const billingData = this.checkoutModel.billingData;
    const isValid =
      billingData.firstName === '' &&
      billingData.lastName === '' &&
      billingData.phoneNumber === '' &&
      billingData.street === '' &&
      billingData.city  === '' &&
      billingData.state === '' &&
      billingData.country === '' &&
      billingData.email === ''&&
      billingData.apartment === '' &&
      billingData.floor === '' &&
      billingData.building === '';



    return isValid;
  }

  // Emit next step event if validation is successful
  onNextStep() {
    if (this.isDeliveryValid()) {
      this.nextStep.emit();
    }
  }
}
