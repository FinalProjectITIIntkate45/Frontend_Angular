import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmPaymentVM } from '../../../Models/ConfirmPaymentVM';
import { CheckoutService } from '../../../Services/checkout.service';


@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.css'],
  standalone: false
})
export class PaymentConfirmationComponent implements OnInit {

  isSuccess: boolean | null = null;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    const transactionId = this.route.snapshot.queryParamMap.get('txn') || '';
    const orderId = Number(this.route.snapshot.queryParamMap.get('orderId'));
    const provider = this.route.snapshot.queryParamMap.get('provider') || 'paymob';

    const confirmData: ConfirmPaymentVM = {
      transactionId,
      orderId,
      paymentProvider: provider
    };

    this.checkoutService.confirmPayment(confirmData).subscribe({
      next: (res) => {
        this.isSuccess = res.isPaymentValid ?? false;
        this.message = res.isPaymentValid ? 'تم الدفع بنجاح 🎉' : 'فشل في تأكيد الدفع ❌';
      },
      error: () => {
        this.isSuccess = false;
        this.message = 'حدث خطأ أثناء تأكيد الدفع.';
      }
    });
  }
}
