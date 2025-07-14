import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../Services/wallet.service';

@Component({
  selector: 'app-wallet-display',
  templateUrl: './wallet-display.component.html',
  styleUrls: ['./wallet-display.component.css'],
  standalone : false
})
export class WalletDisplayComponent implements OnInit {
  walletBalance: number = 0;
  loading = true;
  error: string | null = null;

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.loadWalletBalance();
  }

  loadWalletBalance(): void {
    this.loading = true;
    this.error = null;
    this.walletService.getWalletSummary().subscribe({
      next: (response: any) => {
        this.walletBalance = response.balanceCash || 0;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Could not load your wallet. Please try again.';
        this.loading = false;
      },
    });
  }
} 