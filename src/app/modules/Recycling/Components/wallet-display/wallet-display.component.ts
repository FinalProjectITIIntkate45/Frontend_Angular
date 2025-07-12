import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../Services/wallet.service';
import { Wallet } from '../../../../core/models/wallet.model';

@Component({
  selector: 'app-wallet-display',
  templateUrl: './wallet-display.component.html',
  styleUrls: ['./wallet-display.component.css'],
  standalone: false,
})
export class WalletDisplayComponent implements OnInit {
  wallet: Wallet | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.loadWallet();
  }

  onSectionChange(section: string) {
    console.log('Section changed to:', section);
    // Handle section changes if needed
  }

  loadWallet(): void {
    this.loading = true;
    this.error = null;

    this.walletService.getCompleteWallet().subscribe({
      next: (wallet) => {
        this.wallet = wallet;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading wallet:', error);
        this.error = 'Failed to load wallet information';
        this.loading = false;
      }
    });
  }

  refreshWallet(): void {
    this.loadWallet();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatPoints(points: number): string {
    return new Intl.NumberFormat('en-US').format(points);
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 