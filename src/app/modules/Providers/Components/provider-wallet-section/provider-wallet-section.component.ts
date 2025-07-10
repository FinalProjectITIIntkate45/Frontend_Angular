import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletService } from '../../../../core/services/wallet.service';
import { Wallet } from '../../../../core/models/wallet.model';
import { ProviderWalletRechargeComponent } from '../provider-wallet-recharge/provider-wallet-recharge.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-provider-wallet-section',
  standalone: true,
  imports: [CommonModule, ProviderWalletRechargeComponent],
  templateUrl: './provider-wallet-section.component.html',
  styleUrls: ['./provider-wallet-section.component.css'],
})
export class ProviderWalletSectionComponent implements OnInit, OnDestroy {
  wallet: Wallet | null = null;
  loading = false;
  error: string | null = null;
  private routerSub: Subscription | null = null;

  constructor(private walletService: WalletService, private router: Router) {}

  ngOnInit(): void {
    this.loadWallet();
    this.routerSub = this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationEnd &&
        event.urlAfterRedirects.endsWith('/provider/wallet')
      ) {
        this.loadWallet();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  loadWallet(): void {
    this.loading = true;
    this.walletService.getWallet().subscribe({
      next: (wallet: Wallet) => {
        this.wallet = wallet;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load wallet info';
        this.loading = false;
      },
    });
  }
}
