import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PointService } from '../../Services/point.service';
import {
  StripePaymentService,
  StripeWalletRechargeRequest,
} from '../../../../core/services/stripe-payment.service';

@Component({
  selector: 'app-wallet-recharge',
  templateUrl: './wallet-recharge.component.html',
  styleUrls: ['./wallet-recharge.component.css'],
  standalone: false,
})
export class WalletRechargeComponent implements OnInit {
  rechargeForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  walletBalance: number = 0;

  // Predefined amounts for quick selection
  predefinedAmounts = [10, 25, 50, 100, 200, 500];

  constructor(
    private fb: FormBuilder,
    private stripePaymentService: StripePaymentService,
    private pointService: PointService
  ) {
    this.rechargeForm = this.fb.group({
      amount: [
        '',
        [Validators.required, Validators.min(1), Validators.max(10000)],
      ],
      paymentMethod: ['card'],
    });
  }

  ngOnInit(): void {
    this.loadWalletBalance();
  }

  loadWalletBalance(): void {
    this.pointService.getWalletSummary().subscribe({
      next: (response: any) => {
        this.walletBalance = response.balanceCash || 0;
      },
      error: (err: any) => {
        console.error('Error loading wallet balance:', err);
      },
    });
  }

  selectAmount(amount: number): void {
    this.rechargeForm.patchValue({ amount });
  }

  rechargeWithPaymentIntent(): void {
    if (this.rechargeForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = null;

      const request: StripeWalletRechargeRequest = {
        Amount: this.rechargeForm.value.amount,
        PaymentMethod: this.rechargeForm.value.paymentMethod,
      };

      this.stripePaymentService.createWalletRechargeIntent(request).subscribe({
        next: (response: any) => {
          console.log('Payment intent created:', response);
          // Here you would typically integrate with Stripe Elements
          // For now, we'll show success message
          this.success =
            'Payment intent created successfully. Redirecting to payment...';
          this.loading = false;

          // In a real implementation, you would:
          // 1. Load Stripe.js
          // 2. Create payment element
          // 3. Handle payment confirmation
        },
        error: (err: any) => {
          console.error('Error creating payment intent:', err);
          this.error = 'Failed to create payment intent. Please try again.';
          this.loading = false;
        },
      });
    }
  }

  rechargeWithCheckoutSession(): void {
    if (this.rechargeForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = null;

      const request: StripeWalletRechargeRequest = {
        Amount: this.rechargeForm.value.amount,
        PaymentMethod: this.rechargeForm.value.paymentMethod,
      };

      this.stripePaymentService.createWalletRechargeSession(request).subscribe({
        next: (response: any) => {
          console.log('Checkout session created:', response);
          this.success = 'Redirecting to Stripe checkout...';
          this.loading = false;

          // Redirect to Stripe checkout
          console.log('response.paymentUrl', response.PaymentUrl);
          if (response.PaymentUrl) {
            console.log('redirecting to checkout');
            this.stripePaymentService.redirectToCheckout(response.PaymentUrl);
          }
        },
        error: (err: any) => {
          console.error('Error creating checkout session:', err);
          this.error = 'Failed to create checkout session. Please try again.';
          this.loading = false;
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
