import { Component, OnInit, Inject } from '@angular/core';
import { APIResponse } from '../../../../core/models/APIResponse';
import { AuctionRoomVM } from '../../Models/auction-room-vm';
import { AuctionsWinnerService } from '../../Services/auctions-winner.service';
import { RecyclerRequestService } from '../../Services/RecyclerRequest.service';
import { RecyclingRequestAfterAuctionModel } from '../../Models/recycling-request-after-auction';

@Component({
  selector: 'app-auctions-winner',
  templateUrl: './auctions-winner.component.html',
  styleUrls: ['./auctions-winner.component.css'],
  standalone:false
})
export class AuctionsWinnerComponent implements OnInit {
  auctions: AuctionRoomVM[] = [];
  loading = true;
  error: string | null = null;
  selectedAuctionRequests: { [auctionId: number]: RecyclingRequestAfterAuctionModel[] } = {};
  loadingRequests: { [auctionId: number]: boolean } = {};

  constructor(
    @Inject(AuctionsWinnerService) private auctionsWinnerService: AuctionsWinnerService,
    private recyclerRequestService: RecyclerRequestService
  ) { }

  ngOnInit(): void {
    this.auctionsWinnerService.getAllAuctionsForWinner().subscribe({
      next: (res: APIResponse<AuctionRoomVM[]>) => {
        if (res.IsSuccess) {
          this.auctions = res.Data || [];
        } else {
          this.error = res.Message || 'Failed to load auctions.';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error loading auctions.';
        this.loading = false;
      }
    });
  }

  // Load requests for a specific auction
  loadAuctionRequests(auctionId: number): void {
    if (this.selectedAuctionRequests[auctionId]) {
      // If already loaded, toggle visibility
      delete this.selectedAuctionRequests[auctionId];
      return;
    }

    this.loadingRequests[auctionId] = true;
    this.recyclerRequestService.getRequestsForAuction(auctionId).subscribe({
      next: (requests: any[]) => {
        // تحويل كل object إلى camelCase
        this.selectedAuctionRequests[auctionId] = requests.map(this.mapRequestToCamelCase);
        this.loadingRequests[auctionId] = false;
      },
      error: (err: any) => {
        console.error('Error loading auction requests:', err);
        this.loadingRequests[auctionId] = false;
      }
    });
  }

  // تحويل object من PascalCase إلى camelCase
  mapRequestToCamelCase(request: any): RecyclingRequestAfterAuctionModel {
    return {
      id: request.Id,
      governorate: request.governorate,
      city: request.City,
      address: request.Address,
      unitType: request.UnitType,
      quantity: request.Quantity,
      status: request.Status,
      pendingmMoneyAfterAuction: request.PendingmMoneyAfterAuction,
      pointsAwarded: request.PointsAwarded,
      moneyAward: request.MoneyAward,
      returnType: request.ReturnType,
      createdAt: request.CreatedAt
    };
  }

  // Check if requests are loaded for an auction
  hasRequestsLoaded(auctionId: number): boolean {
    return !!this.selectedAuctionRequests[auctionId];
  }

  getAuctionRequests(auctionId: number): RecyclingRequestAfterAuctionModel[] {
    return this.selectedAuctionRequests[auctionId] || [];
  }

  getStatusText(status: number): string {
    // عدل القيم حسب enum الباك اند عندك
    switch (status) {
      case 0: return 'جديد';
      case 1: return 'قيد الانتظار';
      case 2: return 'مقبول';
      case 3: return 'مرفوض';
      case 4: return 'مكتمل';
      default: return 'غير معروف';
    }
  }

  approveTransaction(requestId: number, auctionId: number): void {
    this.recyclerRequestService.approveMoneyTransaction(requestId).subscribe({
      next: (res) => {
        this.loadAuctionRequests(auctionId);
        alert('Money transaction approved successfully!');
      },
      error: (err) => {
        alert('Error approving transaction!');
        console.error(err);
      }
    });
  }
}
