import { Component, OnInit } from '@angular/core';
import { PointService } from '../../Services/point.service';

@Component({
  selector: 'app-points-section',
  standalone: false,
  templateUrl: './points-section.component.html',
  styleUrls: ['./points-section.component.css'],
})
export class PointsSectionComponent implements OnInit {
  loading = false;
  error: string | null = null;

  // Wallet summary
  walletSummary: any = null;

  // Point summaries
  freePointsSummary: any = null;
  shopPointsSummary: any = null;
  pendingPointsSummary: any = null;

  constructor(private pointService: PointService) {}

  ngOnInit(): void {
    this.loadWalletData();
  }

  loadWalletData(): void {
    this.loading = true;
    this.error = null;

    // Load basic wallet info
    this.pointService.getWalletSummary().subscribe({
      next: (response: any) => {
        console.log('Wallet response:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response));

        // Ensure we have a valid wallet summary
        this.walletSummary = response || {
          balancePoints: 0,
          balanceCash: 0,
          lastUpdated: new Date().toISOString(),
          freePoints: { totalPoints: 0, totalCount: 0, recentPoints: [] },
          shopPoints: { totalPoints: 0, totalCount: 0, recentPoints: [] },
          pendingPoints: { totalPoints: 0, totalCount: 0, recentPoints: [] },
        };

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading wallet:', err);
        console.error('Error details:', err.error);
        this.error = 'Failed to load wallet information.';
        this.loading = false;
      },
    });
  }

  // Load individual point summaries when cards are expanded
  loadFreePoints(): void {
    if (!this.freePointsSummary) {
      this.pointService.getFreePointsSummary().subscribe({
        next: (response: any) => {
          console.log('Free points response:', response);
          this.freePointsSummary = response || [];
        },
        error: (err: any) => {
          console.error('Error loading free points:', err);
        },
      });
    }
  }

  loadShopPoints(): void {
    if (!this.shopPointsSummary) {
      this.pointService.getShopPointsSummary().subscribe({
        next: (response: any) => {
          console.log('Shop points response:', response);
          this.shopPointsSummary = response || [];
        },
        error: (err: any) => {
          console.error('Error loading shop points:', err);
        },
      });
    }
  }

  loadPendingPoints(): void {
    if (!this.pendingPointsSummary) {
      this.pointService.getPendingPointsSummary().subscribe({
        next: (response: any) => {
          console.log('Pending points response:', response);
          this.pendingPointsSummary = response || [];
        },
        error: (err: any) => {
          console.error('Error loading pending points:', err);
        },
      });
    }
  }

  // Helper methods for template
  getTotalFreePoints(): number {
    if (!this.freePointsSummary) return 0;
    return this.freePointsSummary.reduce(
      (total: number, point: any) =>
        total + (point.points || point.Points || 0),
      0
    );
  }

  getTotalShopPoints(): number {
    if (!this.shopPointsSummary) return 0;
    return this.shopPointsSummary.reduce(
      (total: number, point: any) =>
        total + (point.points || point.Points || 0),
      0
    );
  }

  getTotalPendingPoints(): number {
    if (!this.pendingPointsSummary) return 0;
    return this.pendingPointsSummary.reduce(
      (total: number, point: any) =>
        total + (point.points || point.Points || 0),
      0
    );
  }

  getRecentFreePoints(): any[] {
    if (!this.freePointsSummary) return [];
    return this.freePointsSummary.slice(0, 3); // Show only 3 most recent
  }

  getRecentShopPoints(): any[] {
    if (!this.shopPointsSummary) return [];
    return this.shopPointsSummary.slice(0, 3); // Show only 3 most recent
  }

  getRecentPendingPoints(): any[] {
    if (!this.pendingPointsSummary) return [];
    return this.pendingPointsSummary.slice(0, 3); // Show only 3 most recent
  }

  refreshData(): void {
    this.freePointsSummary = null;
    this.shopPointsSummary = null;
    this.pendingPointsSummary = null;
    this.loadWalletData();
  }
}
