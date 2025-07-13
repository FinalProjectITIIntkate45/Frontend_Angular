import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletService } from '../../Services/wallet.service';
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
    private walletService: WalletService
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
    this.walletService.getWalletSummary().subscribe({
      next: (wallet: any) => {
        this.walletBalance = wallet.balanceCash || 0;
      },
      error: (error: any) => {
        console.error('Error loading wallet balance:', error);
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
          this.success =
            'Payment intent created successfully. Redirecting to payment...';
          this.loading = false;
        },
        error: (error: any) => {
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
          this.success = 'Redirecting to Stripe checkout...';
          this.loading = false;
          if (response.PaymentUrl) {
            this.stripePaymentService.redirectToCheckout(response.PaymentUrl);
          }
        },
        error: (error: any) => {
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