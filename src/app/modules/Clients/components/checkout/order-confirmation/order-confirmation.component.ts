// order-confirmation.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { OrderCreateViewModel } from '../../../Models/OrderCreateViewModel';

@Component({
  selector: 'app-order-confirmation',
  standalone: false,
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css'],
})
export class OrderConfirmationComponent {
  @Input() checkoutModel: OrderCreateViewModel;
  @Output() placeOrder: EventEmitter<void> = new EventEmitter<void>();
  @Output() previousStep: EventEmitter<void> = new EventEmitter<void>();
  // add curent step
  @Output() cancelOrder: EventEmitter<void> = new EventEmitter<void>();
  @Output() confirmOrder: EventEmitter<void> = new EventEmitter<void>();

  @Input() currentStep: number = 3; // يجب أن يكون @Input() هنا



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
  onPlaceOrder(): void {
    this.placeOrder.emit();  // Emit event to place order
  }
  onCancelOrder(): void {
    this.cancelOrder.emit();  // Emit event to cancel order
  }
  onConfirmOrder(): void {
    this.confirmOrder.emit();  // Emit event to confirm order
  }
  onPreviousStep(): void {
    this.previousStep.emit();  // Emit event to go to previous step
  }

}
