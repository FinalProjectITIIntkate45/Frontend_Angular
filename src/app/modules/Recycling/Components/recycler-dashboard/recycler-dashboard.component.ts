import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuctionService } from '../../Services/auction.service';
import { AuctionVM } from '../../Models/AuctionVM';
import { APIResponse } from '../../../../core/models/APIResponse';

@Component({
  selector: 'app-recycler-dashboard',
  templateUrl: './recycler-dashboard.component.html',
  styleUrls: ['./recycler-dashboard.component.css'],
  standalone: false
})
export class RecyclerDashboardComponent implements OnInit, OnDestroy {
  // UI state
  isLoading = false;

  // Counters
  totalAuctions: number = 0;
  activeAuctions: number = 0;
  wonAuctions: number = 0;
  allAuctionCount: number = 0;
  allActiveAuctionCount: number = 0;
  successRate: number = 0;

  // Data
  auctions: AuctionVM[] = [];

  // Subscriptions
  private auctionSub!: Subscription;
  private countSub!: Subscription;

  constructor(
    private router: Router,
    private auctionService: AuctionService
  ) {}

  ngOnInit() {
    this.initializeDashboard();
    this.loadDashboardData();
  }

  ngOnDestroy() {
    if (this.auctionSub) this.auctionSub.unsubscribe();
    if (this.countSub) this.countSub.unsubscribe();
  }

  initializeDashboard() {
    // Any future setup can go here
  }

  refreshDashboard() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    this.countSub = this.auctionService.getAllAuctionCount().subscribe({
      next: (response: APIResponse<number>) => {
        if (response.IsSuccess) {
          this.totalAuctions = response.Data;
          this.allAuctionCount = response.Data;
        }
      },
      error: (error) => {
        console.error('Error loading total auction count:', error);
      }
    });

    this.countSub.add(
      this.auctionService.getActiveAuctionCount().subscribe({
        next: (response: APIResponse<number>) => {
          if (response.IsSuccess) {
            this.activeAuctions = response.Data;
            this.allActiveAuctionCount = response.Data;
          }
        },
        error: (error) => {
          console.error('Error loading active auction count:', error);
        }
      })
    );

    this.countSub.add(
      this.auctionService.getWonAuctionCount().subscribe({
        next: (response: APIResponse<number>) => {
          if (response.IsSuccess) {
            this.wonAuctions = response.Data;
            this.calculateSuccessRate();
          }
        },
        error: (error) => {
          console.error('Error loading won auction count:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      })
    );

    this.auctionSub = this.auctionService.getActiveAuctions().subscribe({
      next: (response: APIResponse<AuctionVM[]>) => {
        if (response.IsSuccess) {
          this.auctions = response.Data;
        }
      },
      error: (error) => {
        console.error('Error loading active auctions:', error);
      }
    });
  }

  calculateSuccessRate() {
    if (this.totalAuctions > 0) {
      this.successRate = Math.round((this.wonAuctions / this.totalAuctions) * 100);
    } else {
      this.successRate = 0;
    }
  }

  // Navigation Methods
  browseAuctions() {
    this.router.navigate(['auction-list']);
  }

  seecllauctions() {
    this.router.navigate(['/Recycler/auction-list']);
  }

  viewAllAuctions() {
    this.router.navigate(['/Recycler/auction-list']);
  }

  viewNotifications() {
    this.router.navigate(['/Recycler/notification']);
  }

  viewReports() {
    console.log('/Recycler/View Reports clicked');
  }

  joinAuction(auctionId: number) {
    this.router.navigate(['/Recycler/auctionlist']);
  }

  onSectionChange(event: any) {
    // handle section change if needed
  }
}
