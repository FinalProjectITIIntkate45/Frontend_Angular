import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../Services/wallet.service';
import { WalletView } from '../../Models/wallet.models';
import { AuthService } from '../../../../core/services/Auth.service';

@Component({
  selector: 'app-wallet-section',
  standalone: false,
  templateUrl: './wallet-section.component.html',
  styleUrls: ['./wallet-section.component.css'],
})
export class WalletSectionComponent implements OnInit {
  wallet: WalletView | null = null;
  loading = false;
  error: string | null = null;

  userId: string = '';

  constructor(
    private walletService: WalletService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.getCurrentUserId();
    if (this.userId) {
      this.fetchWallet();
    } else {
      this.error = 'User not logged in.';
    }
  }

  fetchWallet(): void {
    this.loading = true;
    this.error = null;
    this.walletService.getWalletView(this.userId).subscribe({
      next: (data: WalletView) => {
        console.log('data:', data);
        this.wallet = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.log('err:', err);
        this.error = err?.error?.message || 'Failed to load wallet data.';
        this.loading = false;
      },
    });
  }

  getCurrentUserId(): string {
    console.log('getCurrentUserId:', this.authService.getUserId());
    return this.authService.getUserId();
  }
}
