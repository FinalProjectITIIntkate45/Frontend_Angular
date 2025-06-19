import { Component, Input, Output, EventEmitter } from '@angular/core';

import { OrderCreateViewModel } from '../../../Models/OrderCreateViewModel';

@Component({
  selector: 'app-delivery-info',
  standalone: false ,
  templateUrl: './delivery-info.component.html',
  styleUrls: ['./delivery-info.component.css'],
})
export class DeliveryInfoComponent {
  @Input() checkoutModel: OrderCreateViewModel;
  @Input() currentStep: number = 1;
  @Output() nextStep: EventEmitter<void> = new EventEmitter<void>();

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
  isDeliveryValid(): boolean {
    const billingData = this.checkoutModel.billingData;
    return (
      !!billingData.firstName &&
      !!billingData.lastName &&
      !!billingData.phoneNumber &&
      !!billingData.street &&
      !!billingData.city &&
      !!billingData.state &&
      !!billingData.country &&
      !!billingData.email &&
      !!billingData.floor &&
      !!billingData.building &&
      !!billingData.apartment
    );
  }

  onNextStep(): void {
    if (this.isDeliveryValid()) {
      this.nextStep.emit();  // Emit event to go to next step
    }
  }
}
