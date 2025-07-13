import { Component, OnInit, Inject } from '@angular/core';
import { APIResponse } from '../../../../core/models/APIResponse';
import { AuctionRoomVM } from '../../Models/auction-room-vm';
import { AuctionsWinnerService } from '../../Services/auctions-winner.service';

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

  constructor(@Inject(AuctionsWinnerService) private auctionsWinnerService: AuctionsWinnerService) { }

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
}
