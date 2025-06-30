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

  showErrors: boolean = false;

  isDeliveryValid(): boolean {
    const billingData = this.checkoutModel.billingData;
    if (!billingData) return false;

    return (
      billingData.firstName?.trim() &&
      billingData.lastName?.trim() &&
      billingData.phoneNumber?.trim() &&
      billingData.street?.trim() &&
      billingData.city?.trim() &&
      billingData.state?.trim() &&
      billingData.country?.trim() &&
      billingData.email?.trim() &&
      billingData.floor?.trim() &&
      billingData.building?.trim() &&
      billingData.apartment?.trim()
    ) ? true : false;
  }

  onNextStep(): void {
    this.showErrors = true;
    if (this.isDeliveryValid()) {
      this.nextStep.emit();
    }
  }
}
