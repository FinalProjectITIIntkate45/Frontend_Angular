import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { PaymentType } from '../../../Models/CheckoutResultVM';
import { OrderCreateViewModel } from '../../../Models/OrderCreateViewModel';

@Component({
  selector: 'app-order-confirmation',
  standalone: false,
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css'],
})
export class OrderConfirmationComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log('data', this.checkoutModel);
  }
  @Input() checkoutModel!: OrderCreateViewModel;
  @Input() currentStep: number = 3;

  @Output() placeOrder = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();

  onConfirmOrder(): void {
    this.placeOrder.emit();
  }

  onCancelOrder(): void {
    this.previousStep.emit();
  }

  getPaymentLabel(type: PaymentType): string {
    switch (type) {
      case PaymentType.PointsOnly:
        return 'Points Only';
      case PaymentType.CashCollection:
        return 'Cash Collection';
      case PaymentType.AcceptKiosk:
        return 'Accept Kiosk';
      case PaymentType.MobileWallet:
        return 'Mobile Wallet';
      case PaymentType.PayPal:
        return 'PayPal';
      case PaymentType.OnlineCard:
        return 'Stripe / Online Card';
      case PaymentType.Paymob:
        return 'Paymob';
      case PaymentType.CashOnDelivery:
        return 'Cash on Delivery';
      default:
        return 'Unknown';
    }
  }
}
