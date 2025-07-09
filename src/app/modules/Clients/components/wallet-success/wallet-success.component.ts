import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletService } from '../../../../core/services/wallet.service';
import { StripePaymentService } from '../../../../core/services/stripe-payment.service';

@Component({
  selector: 'app-wallet-success',
  templateUrl: './wallet-success.component.html',
  styleUrls: ['./wallet-success.component.css'],
  standalone: false,
})
export class WalletSuccessComponent implements OnInit {
  sessionId: string = '';
  loading: boolean = true;
  error: string | null = null;
  success: boolean = false;
  paymentDetails: any = null;
  walletBalance: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private walletService: WalletService,
    private stripePaymentService: StripePaymentService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.sessionId = params['session_id'];
      if (this.sessionId) {
        this.verifyPayment();
      } else {
        this.error = 'No session ID provided';
        this.loading = false;
      }
    });
  }

  verifyPayment(): void {
    this.loading = true;
    this.error = null;
    this.success = false;
    this.stripePaymentService
      .confirmWalletRechargeSession(this.sessionId)
      .subscribe({
        next: (result) => {
          this.success = true;
          this.loadWalletBalance();
        },
        error: (err) => {
          this.error = 'Failed to confirm payment. Please contact support.';
          this.loading = false;
        },
      });
  }

  loadWalletBalance(): void {
    this.walletService.getWallet().subscribe({
      next: (wallet) => {
        this.walletBalance = wallet.balancecash || 0;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading wallet balance';
        this.loading = false;
      },
    });
  }

  goToWallet(): void {
    this.router.navigate(['/client/wallet-recharge']);
  }

  goToShop(): void {
    this.router.navigate(['/client/products']);
  }
}
