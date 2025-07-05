import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../Services/wallet.service';
import {
  WalletView,
  ShopPoint,
  FreePoint,
  ShopInfo,
} from '../../Models/wallet.models';
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
    this.fetchWallet();
  }

  fetchWallet(): void {
    this.loading = true;
    this.error = null;
    this.walletService.getWalletView(this.userId).subscribe({
      next: (data: any) => {
        console.log('data:', data);
        this.wallet = this.mapApiWalletToModel(data?.Data ?? {});
        this.loading = false;
      },
      error: (err: any) => {
        console.log('err:', err);
        this.error = err?.error?.message || 'Failed to load wallet data.';
        this.loading = false;
      },
    });
  }

  mapApiWalletToModel(apiData: any): WalletView {
    return {
      ShopPoints: (apiData.ShopPoints || []).map(
        (sp: any): ShopPoint => ({
          id: sp.Id,
          points: sp.Points,
          earnedAt: sp.EarnedAt,
          expireAt: sp.ExpireAt,
          shop: sp.Shop
            ? {
                id: sp.Shop.Id,
                name: sp.Shop.Name,
                logo: sp.Shop.Logo,
                typeId: sp.Shop.TypeId,
                shopType: sp.Shop.ShopType,
              }
            : { id: 0, name: '', logo: '', typeId: 0, shopType: '' },
        })
      ),
      FreePoints: (apiData.FreePoints || []).map(
        (fp: any): FreePoint => ({
          id: fp.Id,
          points: fp.Points,
          earnedAt: fp.EarnedAt,
          expireAt: fp.ExpireAt,
          sourceType: fp.SourceType,
          reference: fp.Reference,
        })
      ),
    };
  }
}
