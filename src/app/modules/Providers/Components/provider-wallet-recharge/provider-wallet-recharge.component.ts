import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  StripePaymentService,
  StripeWalletRechargeRequest,
} from '../../../../core/services/stripe-payment.service';

@Component({
  selector: 'app-provider-wallet-recharge',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './provider-wallet-recharge.component.html',
  styleUrls: ['./provider-wallet-recharge.component.css'],
})
export class ProviderWalletRechargeComponent implements OnInit {
  @Output() recharged = new EventEmitter<void>();
  rechargeForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  predefinedAmounts = [10, 25, 50, 100, 200, 500];

  constructor(
    private fb: FormBuilder,
    private stripePaymentService: StripePaymentService
  ) {
    this.rechargeForm = this.fb.group({
      amount: [
        '',
        [Validators.required, Validators.min(1), Validators.max(10000)],
      ],
      paymentMethod: ['card'],
    });
  }

  ngOnInit(): void {}

  selectAmount(amount: number): void {
    this.rechargeForm.patchValue({ amount });
  }

  rechargeWithCheckoutSession(): void {
    if (this.rechargeForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = null;

      const request: StripeWalletRechargeRequest = {
        Amount: this.rechargeForm.value.amount,
        PaymentMethod: this.rechargeForm.value.paymentMethod,
        redirectPath: '/provider/wallet/success',
      };

      console.log(
        '[ProviderWalletRecharge] Creating Stripe session with request:',
        request
      );
      this.stripePaymentService.createWalletRechargeSession(request).subscribe({
        next: (response: any) => {
          this.success = 'Redirecting to Stripe checkout...';
          this.loading = false;
          console.log(
            '[ProviderWalletRecharge] Stripe session response:',
            response
          );
          if (response.PaymentUrl) {
            console.log(
              '[ProviderWalletRecharge] Redirecting to:',
              response.PaymentUrl
            );
            this.stripePaymentService.redirectToCheckout(response.PaymentUrl);
            this.recharged.emit();
          }
        },
        error: (err: any) => {
          this.error = 'Failed to create checkout session. Please try again.';
          this.loading = false;
          console.error(
            '[ProviderWalletRecharge] Error creating Stripe session:',
            err
          );
        },
      });
    }
  }

  resetForm(): void {
    this.rechargeForm.reset({ paymentMethod: 'card' });
    this.error = null;
    this.success = null;
  }

  get amount() {
    return this.rechargeForm.get('amount');
  }
}
