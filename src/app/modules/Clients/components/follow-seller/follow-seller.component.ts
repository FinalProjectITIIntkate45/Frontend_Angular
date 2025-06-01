import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FollowSellerService } from '../../Services/follow.service'; 


@Component({
  selector: 'app-follow-seller',
  templateUrl: './follow-seller.component.html',
  styleUrls: ['./follow-seller.component.css'],
  standalone:false,
})
export class FollowSellerComponent implements OnInit {
  clientId = 'client1'; 
  followedShops: number[] = [];
  newShopId: number = 0;

  constructor(private followService: FollowSellerService) {}

  ngOnInit(): void {
    this.loadFollowedShops();
  }

  loadFollowedShops() {
    this.followService.getFollowedShops(this.clientId).subscribe({
      next: (shops) => (this.followedShops = shops),
      error: (err) => console.error(err),
    });
  }

  follow() {
    if (!this.newShopId) return;

    this.followService.followShop(this.clientId, this.newShopId).subscribe({
      next: () => {
        this.loadFollowedShops();
        this.newShopId = 0;
      },
      error: (err) => alert(err.error || 'Follow failed'),
    });
  }

  unfollow(shopId: number) {
    this.followService.unfollowShop(this.clientId, shopId).subscribe({
      next: () => this.loadFollowedShops(),
      error: (err) => alert('Unfollow failed'),
    });
  }
}




