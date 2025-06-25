import { Component, Input, Output, EventEmitter } from '@angular/core';

import { OrderCreateViewModel } from '../../../Models/OrderCreateViewModel';

@Component({
  selector: 'app-delivery-info',
  standalone: false,
  templateUrl: './delivery-info.component.html',
  styleUrls: ['./delivery-info.component.css'],
})
export class DeliveryInfoComponent {
  @Input() checkoutModel!: OrderCreateViewModel;
  @Input() currentStep: number = 1;
  @Output() nextStep: EventEmitter<void> = new EventEmitter<void>();

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
      this.nextStep.emit();
    }
  }
}
