import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { NotificationService, NotificationModel } from '../../Services/notification.service.service';
import { AuctionService } from '../../Services/auction.service';
import { AuctionRoomVM } from '../../Models/auction-room-vm';
import { RecyclerVM } from '../../Models/RecyclerVM';
import { environment } from '../../../../../environments/environment';
import { AuctionBidService } from '../../Services/auction-bid.service';
import { AuctionBidSignalrService } from '../../Services/auction-bid-signalr.service';
import { AuctionBidViewModel } from '../../Models/AuctionBidViewModel';

interface BidPayload {
  bid: number;
  auctionId: number;
  recyclingName: string;
  timestamp?: Date;
  userId?: string;
}

interface TopBid {
  position: number;
  bid: number;
  recyclingName: string;
  timestamp: Date;
}

@Component({
  selector: 'app-auction-room',
  templateUrl: './auction-room.component.html',
  styleUrls: ['./auction-room.component.css'],
  standalone : false
})
export class AuctionRoomComponent implements OnInit, OnDestroy {
  auctionId!: number;
  auction?: AuctionRoomVM;
  winner?: RecyclerVM;
  connection!: signalR.HubConnection;

  currentUser: string = '';
  bidAmount: number = 0;
  highestBid: number = 0;
  private highestBidInitialized = false;
  bidHistory: AuctionBidViewModel[] = [];
  top3Bids: TopBid[] = [];
  myBids: AuctionBidViewModel[] = [];

  // UI
  showNotificationPanel = false;
  notifications: NotificationModel[] = [];
  notificationCount = 0;
  isPlacingBid = false;
  bidError: string = '';
  bidSuccess: string = '';
  showAllBids = false;
  countdown: string = '';
  countdownPercent: number = 100;
  countdownMinutes: number = 0;
  bidFlash: boolean = false;
  liveFeedback: string[] = [];
  userRank: number = 0;
  private countdownInterval: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService,
    private auctionService: AuctionService,
    private bidService: AuctionBidService,
    private signalRService: AuctionBidSignalrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.auctionId = +params['id'];
      this.initAuctionRoom();
      this.signalRService.connect(this.auctionId); // الاتصال والانضمام للجروب تلقائي
      this.setupSignalR();
    });
  }

  ngOnDestroy(): void {
    this.signalRService.leaveAuctionGroup(this.auctionId);
    this.signalRService.disconnect();
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  setupSignalR(): void {
    // استقبال مزايدة جديدة
    this.signalRService.newBid$.subscribe(payload => {
      if (!payload) return; // تجاهل القيمة الأولية null
      console.log('📡 [Component] NewBid payload:', payload);
      const bid = payload.auctionBidViewModel;
      const newBid: AuctionBidViewModel = {
        bidAmount: bid.bidAmount ?? bid.BidAmount,
        status: bid.status ?? bid.Status,
        createdAt: bid.createdAt ?? bid.CreatedAt,
        recyclerName: bid.recyclerName ?? bid.RecyclerName
      };
      this.bidHistory.unshift(newBid);
      // تحديث أعلى مزايدة فقط من السيجنال آر
      if (newBid.bidAmount > this.highestBid) {
        this.highestBid = newBid.bidAmount;
      }
      this.bidHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.updateTop3Bids();
      this.updateUserRank();
      this.updateMyBids();
      this.addLiveFeedback(newBid);
      this.triggerBidFlash(newBid.bidAmount);
      this.cdr.detectChanges();
    });

    // تحديث أعلى مزايدة
    this.signalRService.updateMaxBid$.subscribe(payload => {
      if (!payload) return;
      const bid = payload.auctionBidViewModel;
      this.highestBid = bid.bidAmount ?? bid.BidAmount ?? 0;
      this.updateTop3Bids();
      this.updateUserRank();
      this.cdr.detectChanges();
    });

    // تحديث مزايدات المستخدم
    this.signalRService.userBids$.subscribe(payload => {
      if (!payload) return;
      this.myBids = (payload.bids || [])
        .map((bid: any) => ({
          bidAmount: bid.BidAmount ?? bid.bidAmount,
          status: bid.Status ?? bid.status,
          createdAt: bid.CreatedAt ?? bid.createdAt,
          recyclerName: bid.RecyclerName ?? bid.recyclerName
        }))
        .sort((a: AuctionBidViewModel, b: AuctionBidViewModel) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // ترتيب تنازلي
      this.cdr.detectChanges();
    });
  }

  handleNewBid(payload: any): void {
    // إضافة المزايدة الجديدة للتاريخ
    const newBid: AuctionBidViewModel = {
      bidAmount: payload.bidAmount || 0,
      recyclerName: payload.recyclerName || 'Unknown User',
      createdAt: new Date().toISOString(),
      status: payload.status || 1
    };
    
    // تحديث أعلى مزايدة إذا كانت المزايدة الجديدة أعلى
    if (newBid.bidAmount > this.highestBid) {
      this.highestBid = newBid.bidAmount;
    }
    
    this.bidHistory.unshift(newBid);
    this.updateTop3Bids();
    this.updateUserRank();
    this.updateMyBids();
    
    // إضافة رسالة للفيدباك المباشر
    this.addLiveFeedback(newBid);
    
    // فلاش للمزايدة الجديدة
    this.triggerBidFlash(newBid.bidAmount);
  }

  addLiveFeedback(bid: AuctionBidViewModel): void {
    const name = bid.recyclerName ?? 'Unknown User';
    const amount = bid.bidAmount ?? 0;
    const message = `${name} placed a bid of ${amount} EGP`;
    this.liveFeedback.unshift(message);
    if (this.liveFeedback.length > 5) {
      this.liveFeedback.pop();
    }
  }

  triggerBidFlash(bidAmount: number): void {
    if (bidAmount > this.highestBid) {
      this.bidFlash = true;
      setTimeout(() => this.bidFlash = false, 700);
    }
  }

  initAuctionRoom(): void {
    this.currentUser = localStorage.getItem('userId') || '';
    this.loadAuctionDetails();
    this.fetchInitialData();
    this.connectNotificationService();
    this.startCountdown();
  }

  loadAuctionDetails(): void {
    this.auctionService.getAuctionDetails(this.auctionId).subscribe({
      next: res => {
        if (res.IsSuccess && res.Data) {
          this.auction = res.Data;
          if (this.auction.AuctionStatus === 'Completed') {
            this.loadAuctionWinner();
          }
        }
      },
      error: err => console.error('Failed to load auction details:', err)
    });
  }

  loadAuctionWinner(): void {
    this.auctionService.getAuctionWinner(this.auctionId).subscribe({
      next: winner => this.winner = winner,
      error: err => console.error('Failed to load auction winner:', err)
    });
  }

  fetchInitialData(): void {
    // جلب أعلى مزايدة
    this.fetchInitialMaxBid();
    // جلب تاريخ المزايدات
    this.fetchBidHistory();
  }

  fetchInitialMaxBid(): void {
    this.bidService.getMaxBid(this.auctionId).subscribe({
      next: data => {
        if (!this.highestBidInitialized) {
          const bid = (data as any).Data;
          this.highestBid = bid ? (bid.BidAmount ?? bid.bidAmount ?? 0) : 0;
          this.highestBidInitialized = true;
        }
      },
      error: err => {
        if (!this.highestBidInitialized) {
          this.highestBid = 0;
          this.highestBidInitialized = true;
        }
      }
    });
  }

  fetchBidHistory(): void {
    this.bidService.getAllBids(this.auctionId).subscribe({
      next: res => {
        this.bidHistory = (res.Data || []).map((bid: any) => ({
          bidAmount: bid.BidAmount ?? bid.bidAmount,
          status: bid.Status ?? bid.status,
          createdAt: bid.CreatedAt ?? bid.createdAt,
          recyclerName: bid.RecyclerName ?? bid.recyclerName
        }));
        // ترتيب تنازلي حسب التاريخ
        this.bidHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.updateTop3Bids();
        this.updateMyBids();
        this.updateUserRank();
      },
      error: err => {
        console.error('Failed to load bid history:', err);
        this.bidHistory = [];
        this.top3Bids = [];
        this.myBids = [];
        this.userRank = 0;
      }
    });
  }

  placeBid(): void {
    if (!this.bidAmount || this.bidAmount <= this.highestBid) {
      this.bidError = 'The bid must be higher than the current bid';
      this.bidSuccess = '';
      return;
    }

    this.bidError = '';
    this.bidSuccess = '';
    this.isPlacingBid = true;

    const bidData = {
      auctionId: this.auctionId,
      amount: this.bidAmount
    };
    
    console.log('🚀 Sending bid data:', bidData);

    this.bidService.placeBid(bidData).subscribe({
      next: (response) => {
        this.isPlacingBid = false;
        this.bidSuccess = 'Bid placed successfully!';
        this.bidAmount = 0;
        console.log('✅ Bid placed successfully:', response);
        // لا تعيد تحميل الداتا من الكنترولر هنا، فقط انتظر SignalR
      },
      error: (err) => {
        this.isPlacingBid = false;
        this.bidError = err?.error?.message || 'An error occurred while placing the bid';
        console.error('❌ Bid error:', err);
      }
    });
  }

  updateTop3Bids(): void {
    const sortedBids = [...this.bidHistory].sort((a, b) => b.bidAmount - a.bidAmount);
    this.top3Bids = sortedBids.slice(0, 3).map((bid, index) => ({
      position: index + 1,
      bid: bid.bidAmount,
      recyclingName: bid.recyclerName || 'Unknown User', // اجعلها string دائمًا
      timestamp: new Date(bid.createdAt)
    }));
  }

  updateMyBids(): void {
    this.myBids = this.bidHistory.filter(bid => bid.recyclerName === this.currentUser);
  }

  updateUserRank(): void {
    const sortedBids = [...this.bidHistory].sort((a, b) => b.bidAmount - a.bidAmount);
    const idx = sortedBids.findIndex(bid => bid.recyclerName === this.currentUser);
    this.userRank = idx >= 0 ? idx + 1 : 0;
  }

  getUnitTypeDisplayName(unitType: number): string {
    switch (unitType) {
      case 1: return 'Kilogram';
      case 2: return 'Gram';
      case 3: return 'Liter';
      case 4: return 'Milliliter';
      case 5: return 'Piece';
      case 6: return 'Meter';
      case 7: return 'Centimeter';
      default: return 'Unknown Unit';
    }
  }

  getTimeAgo(date: Date | string | undefined): string {
    if (!date) return 'Not specified';
    
    try {
      const now = new Date();
      const targetDate = typeof date === 'string' ? new Date(date) : date;
      
      if (isNaN(targetDate.getTime())) {
        return 'Invalid date';
      }
      
      const diff = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
      
      if (diff < 0) return 'In the future';
      if (diff < 60) return 'Now';
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours`;
      return `${Math.floor(diff / 86400)} days`;
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Invalid date';
    }
  }

  toggleNotificationPanel(): void {
    this.showNotificationPanel = !this.showNotificationPanel;
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userId');
      localStorage.removeItem('userToken');
      this.notificationService.disconnect();
      this.router.navigate(['/login']);
    }
  }

  connectNotificationService(): void {
    this.notificationService.connect();
    this.notificationService.notifications$.subscribe(n => {
      this.notifications = n;
      this.notificationCount = n.length;
    });
  }

  toggleBidHistory(): void {
    this.showAllBids = !this.showAllBids;
  }

  getCountdown(endTime?: string | Date): string {
    if (!endTime) return '';
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    let diff = Math.max(0, end - now);
    if (diff <= 0) return 'Auction ended';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * 1000 * 60;
    const seconds = Math.floor(diff / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      if (this.auction?.EndTime) {
        try {
          const end = new Date(this.auction.EndTime).getTime();
          const now = new Date().getTime();
          const diff = Math.max(0, end - now);
          this.countdown = this.getCountdown(this.auction.EndTime);
          this.countdownMinutes = Math.floor(diff / 60000);
          
          if (this.auction.StartTime) {
            const total = end - new Date(this.auction.StartTime).getTime();
            this.countdownPercent = total ? Math.max(0, Math.min(100, (diff / total) * 100)) : 0;
          }
          
          // If the auction has ended
          if (diff <= 0 && this.auction.AuctionStatus !== 'Completed') {
            this.loadAuctionDetails(); // Reload the auction details to check the status
          }
        } catch (error) {
          console.error('Error in countdown:', error);
        }
      }
    }, 1000);
  }

  goToAuctionDetail(): void {
    this.router.navigate(['auction-detail', this.auctionId]);
  }

  goToAllAuctions(): void {
    this.router.navigate(['get-all-auctions']);
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getPositionClass(position: number): string {
    switch (position) { 
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return 'bronze';
      default: return '';
    }
  }

  // trackBy functions to improve performance
  trackByBid(index: number, bid: any): string {
    return bid.recyclerName + bid.bidAmount + bid.createdAt;
  }

  trackByFeedback(index: number, feedback: string): string {
    return feedback + index;
  }
}
