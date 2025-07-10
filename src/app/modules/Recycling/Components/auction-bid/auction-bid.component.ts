import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuctionBidService } from '../../Services/auction-bid.service';
import { AuctionBidSignalrService } from '../../Services/auction-bid-signalr.service';
import { AuctionBidViewModel } from '../../Models/AuctionBidViewModel';
import { BidViewModel } from '../../Models/BidViewModel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auction-bid',
  templateUrl: './auction-bid.component.html',
  standalone : false
})
export class AuctionBidComponent implements OnInit, OnDestroy {
placeBid() {
  if (!this.newBidAmount || this.newBidAmount <= 0) {
    alert('Please enter a valid bid amount.');
    return;
  }

  const bid: BidViewModel = {
    auctionId: this.auctionId,
    amount: this.newBidAmount
  };

  this.bidService.placeBid(bid).subscribe(
    (res: any) => {
      if (res.isSuccess) {
        alert('✅ Bid placed successfully');
        this.newBidAmount = 0;
        // SignalR will update the bids list automatically
      } else {
        alert(res.message || 'Failed to place bid');
      }
    },
    (err) => {
      alert('Error placing bid');
    }
  );
}

  auctionId: number = 1;
  newBidAmount: number = 0;
  bids: AuctionBidViewModel[] = [];
  topThreeBids: AuctionBidViewModel[] = [];
  private bidSub!: Subscription;

  constructor(
    private bidService: AuctionBidService,
    private signalrService: AuctionBidSignalrService
  ) {}

  ngOnInit(): void {
    this.loadBids();
    this.signalrService.startConnection();
    this.signalrService.joinAuctionGroup(this.auctionId);

    this.bidSub = this.signalrService.newBid$.subscribe(data => {
      console.log('📡 Received NewBid:', data);
      this.loadBids();
    });
  }

  ngOnDestroy(): void {
    this.signalrService.leaveAuctionGroup(this.auctionId);
    this.signalrService.stopConnection();
    if (this.bidSub) this.bidSub.unsubscribe();
  }

  loadBids(): void {
    this.bidService.getAllBids(this.auctionId).subscribe(data => {
      this.bids = data.Data || [];

      this.topThreeBids = [...this.bids]
        .sort((a, b) => b.bidAmount - a.bidAmount)
        .slice(0, 3);
    });
  }

  submitBid(): void {
    const bid: BidViewModel = {
      auctionId: this.auctionId,
      amount: this.newBidAmount
    };

    this.bidService.placeBid(bid).subscribe(res => {
      alert(res.message || '✅ Bid placed');
      this.newBidAmount = 0;
      // التحديث هيحصل تلقائي من SignalR
    });
  }
}
