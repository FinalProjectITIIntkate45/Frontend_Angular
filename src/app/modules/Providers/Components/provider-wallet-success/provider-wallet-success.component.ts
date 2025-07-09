import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { WalletService } from '../../../../core/services/wallet.service';
import { StripePaymentService } from '../../../../core/services/stripe-payment.service';

@Component({
  selector: 'app-provider-wallet-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-wallet-success.component.html',
  styleUrls: ['./provider-wallet-success.component.css'],
})
export class ProviderWalletSuccessComponent implements OnInit {
  loading: boolean = true;
  error: string | null = null;
  message: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private walletService: WalletService,
    private stripePaymentService: StripePaymentService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const sessionId = params['session_id'];
      if (sessionId) {
        this.confirmSession(sessionId);
      } else {
        this.error = 'No session ID provided.';
        this.loading = false;
      }
    });
  }

  confirmSession(sessionId: string): void {
    this.loading = true;
    this.error = null;
    this.stripePaymentService
      .confirmWalletRechargeSession(sessionId)
      .subscribe({
        next: () => {
          this.message = 'Wallet recharge confirmed!';
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Failed to confirm payment. Please contact support.';
          this.loading = false;
        },
      });
  }

  goToWallet() {
    this.router.navigate(['/provider/wallet']);
  }
}
