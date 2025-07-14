import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuctionVM } from '../../Models/AuctionVM';
import { AuctionRoomVM } from '../../Models/auction-room-vm';
import { RecyclerVM } from '../../Models/RecyclerVM';
import { AuctionRecyclingRequestVM, JoinAuctionViewModel, AuctionRecyclingStatus } from '../../Models/auction-recycling-request';
import { AuctionRecyclingRequestDisplyVM } from '../../Models/auction-request-display';
import { AuctionService } from '../../Services/auction.service';
import { RecyclerRequestService } from '../../Services/RecyclerRequest.service';
import { NotificationService } from '../../Services/notification.service.service';
import { AuctionBidService } from '../../Services/auction-bid.service';
import { AuctionBidViewModel } from '../../Models/AuctionBidViewModel';
import { BidViewModel } from '../../Models/BidViewModel';

@Component({
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.css'],
  standalone: false
})
export class AuctionDetailComponent implements OnInit {
  auction?: AuctionRoomVM;
  winner?: RecyclerVM;
  id!: number;
  isJoined = false;
  currentRequest?: AuctionRecyclingRequestDisplyVM;
  isLoading = true;
  
  // Bidding properties
  maxBid: AuctionBidViewModel | null = null;
  bids: AuctionBidViewModel[] = [];
  bidAmount: number | null = null;
  message: string = '';

  // Request states
  creatingRequest = false;
  withdrawingRequest = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auctionService: AuctionService,
    private recyclerRequestService: RecyclerRequestService,
    private notificationService: NotificationService,
    private auctionBidService: AuctionBidService
  ) {}

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.loadAuctionDetails();
    this.checkIfJoined();
    this.connectNotificationService();
    this.loadBids();
    this.loadMaxBid();
  }

  // Handle section change from RecyclerLayout
  onSectionChange(section: string) {
    console.log('Section changed to:', section);
    // Handle navigation based on section if needed
  }

  loadAuctionDetails() {
    this.isLoading = true;
    this.auctionService.getAuctionDetails(this.id).subscribe((response) => {
      if (response.IsSuccess && response.Data) {
        this.auction = response.Data;
        if (this.auction.AuctionStatus === 'Completed') {
          this.auctionService.getAuctionWinner(this.id).subscribe((w: RecyclerVM) => this.winner = w);
        }
      } else {
        console.error('Failed to load auction details:', response.Message);
      }
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  connectNotificationService() {
    this.notificationService.connect();
  }

  checkIfJoined() {
    this.recyclerRequestService.hasJoinedAuction(this.id).subscribe((joined: boolean) => {
      this.isJoined = joined;
      if (joined) {
        this.loadCurrentRequest();
      }
    });
  }

  loadCurrentRequest() {
    this.recyclerRequestService.getRecyclerRequests().subscribe((requests: AuctionRecyclingRequestDisplyVM[]) => {
      this.currentRequest = requests.find(req => req.auctionId === this.id);
    });
  }

  createRequestToJoin() {
    if (!this.auction) return;

    this.creatingRequest = true;
    const request: AuctionRecyclingRequestVM = {
      auctionId: this.auction.Id
    };

    this.recyclerRequestService.createRequestToJoin(request).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Request to join auction created successfully');
          this.checkIfJoined();
        } else {
          alert('Request to join auction created successfully');
        }
      },
      error: (error) => {
        console.error('Error creating request:', error);
        alert('An error occurred while creating the request');
        this.creatingRequest = false;
      }
    });
  }

  withdrawRequest() {
    if (!this.currentRequest) return;

    if (!confirm('Are you sure you want to withdraw from the auction?')) return;

    this.withdrawingRequest = true;
    const model: JoinAuctionViewModel = {
      recyclingRequestId: this.currentRequest.recyclingRequestId,
      auctionId: this.currentRequest.auctionId
    };

    this.recyclerRequestService.withdrawRequest(model).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Withdraw from auction successful');
          this.checkIfJoined();
        } else {
          alert(response.message || 'An error occurred while withdrawing from the auction');
        }
        this.withdrawingRequest = false;
      },
      error: (error) => {
        console.error('Error withdrawing request:', error);
        alert('An error occurred while withdrawing from the auction');
        this.withdrawingRequest = false;
      }
    });
  }

  getStatusClass(status: number): string {
    switch (status) {
      case AuctionRecyclingStatus.Pending:
        return 'status-pending';
      case AuctionRecyclingStatus.Accepted:
        return 'status-accepted';
      case AuctionRecyclingStatus.Rejected:
        return 'status-rejected';
      case AuctionRecyclingStatus.Completed:
        return 'status-completed';
      default:
        return 'status-default';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case AuctionRecyclingStatus.Pending:
        return 'Waiting for approval';
      case AuctionRecyclingStatus.Accepted:
        return 'Approved';
      case AuctionRecyclingStatus.Rejected:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  getUnitTypeDisplayName(unitType: number): string {
    switch (unitType) {
      case 1:
        return 'Kilogram';
      case 2:
        return 'Gram';
      case 3:
        return 'Liter';
      case 4:
        return 'Milliliter';
      case 5:
        return 'Piece';
      case 6:
        return 'Meter';
      case 7:
        return 'Centimeter';
      default:
        return 'Unknown Unit';
    }
  }

  loadBids() {
    this.auctionBidService.getAllBids(this.id).subscribe({
      next: (res) => this.bids = res.Data || [],
      error: () => this.bids = []
    });
  }

  loadMaxBid() {
    this.auctionBidService.getMaxBid(this.id).subscribe({
      next: (maxBid) => this.maxBid = maxBid,
      error: () => this.maxBid = null
    });
  }

  placeBid() {
    if (this.bidAmount == null || this.bidAmount <= 0) {
      this.message = 'Please enter a valid bid amount';
      return;
    }
    const bid: BidViewModel = {
      auctionId: this.id,
      amount: this.bidAmount
    };
    this.auctionBidService.placeBid(bid).subscribe({
      next: (res) => {
        if (res && res.isSuccess) {
          this.message = 'Bid placed successfully';
          this.loadBids();
          this.loadMaxBid();
        } else {
          this.message = res?.message || 'An error occurred while placing the bid';
        }
      },
      error: (err) => {
        this.message = err?.error?.message || 'An error occurred while placing the bid';
      }
    });
  }
}
