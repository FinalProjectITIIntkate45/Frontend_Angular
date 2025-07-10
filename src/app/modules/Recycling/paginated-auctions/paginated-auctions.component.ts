import { Component, OnInit } from '@angular/core';
import { AuctionVM } from '../Models/AuctionVM';
import { AuctionRequestService } from '../Services/auction-request.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-paginated-auctions',
  templateUrl: './paginated-auctions.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class PaginatedAuctionsComponent implements OnInit {
  auctions: AuctionVM[] = [];
  city = '';
  pageSize = 5;
  pageNumber = 1;

  constructor(private auctionReqService: AuctionRequestService) {}

  ngOnInit() {
    this.loadAuctions();
  }

  loadAuctions() {
    this.auctionReqService.getPaginatedAuctions(this.city, this.pageSize, this.pageNumber)
      .subscribe((res: AuctionVM[]) => this.auctions = res);
  }

  nextPage() {
    this.pageNumber++;
    this.loadAuctions();
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadAuctions();
    }
  }
}
