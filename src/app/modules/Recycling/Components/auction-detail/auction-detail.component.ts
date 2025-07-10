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
          alert('تم إنشاء طلب الانضمام بنجاح');
          this.checkIfJoined();
        } else {
          alert(response.message || 'حدث خطأ أثناء إنشاء الطلب');
        }
        this.creatingRequest = false;
      },
      error: (error) => {
        console.error('Error creating request:', error);
        alert('حدث خطأ أثناء إنشاء الطلب');
        this.creatingRequest = false;
      }
    });
  }

  withdrawRequest() {
    if (!this.currentRequest) return;

    if (!confirm('هل أنت متأكد من الانسحاب من المزاد؟')) return;

    this.withdrawingRequest = true;
    const model: JoinAuctionViewModel = {
      recyclingRequestId: this.currentRequest.recyclingRequestId,
      auctionId: this.currentRequest.auctionId
    };

    this.recyclerRequestService.withdrawRequest(model).subscribe({
      next: (response) => {
        if (response.success) {
          alert('تم الانسحاب من المزاد بنجاح');
          this.checkIfJoined();
        } else {
          alert(response.message || 'حدث خطأ أثناء الانسحاب');
        }
        this.withdrawingRequest = false;
      },
      error: (error) => {
        console.error('Error withdrawing request:', error);
        alert('حدث خطأ أثناء الانسحاب');
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
        return 'في انتظار الموافقة';
      case AuctionRecyclingStatus.Accepted:
        return 'تمت الموافقة';
      case AuctionRecyclingStatus.Rejected:
        return 'مرفوض';
      case AuctionRecyclingStatus.Completed:
        return 'مكتمل';
      default:
        return 'غير معروف';
    }
  }

  getUnitTypeDisplayName(unitType: number): string {
    switch (unitType) {
      case 1:
        return 'كيلوجرام';
      case 2:
        return 'جرام';
      case 3:
        return 'لتر';
      case 4:
        return 'مليلتر';
      case 5:
        return 'قطعة';
      case 6:
        return 'متر';
      case 7:
        return 'سنتيمتر';
      default:
        return 'وحدة غير معروفة';
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
      this.message = 'يرجى إدخال قيمة مزايدة صحيحة';
      return;
    }
    const bid: BidViewModel = {
      auctionId: this.id,
      amount: this.bidAmount
    };
    this.auctionBidService.placeBid(bid).subscribe({
      next: (res) => {
        if (res && res.isSuccess) {
          this.message = 'تمت المزايدة بنجاح';
          this.loadBids();
          this.loadMaxBid();
        } else {
          this.message = res?.message || 'حدث خطأ أثناء المزايدة';
        }
      },
      error: (err) => {
        this.message = err?.error?.message || 'حدث خطأ أثناء المزايدة';
      }
    });
  }
}
