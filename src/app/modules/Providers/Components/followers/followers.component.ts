import { Component, OnInit } from '@angular/core';
import { FollowSellerService } from '../../Services/follow-seller.service';
import { FollowedSeller } from '../../Models/FollowedSeller.model';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css'],
  standalone: false, 
})
export class FollowersComponent implements OnInit {
  followers: FollowedSeller[] = [];

  constructor(private followService: FollowSellerService) {}

  ngOnInit(): void {
    const currentVendorId = 'vendor-id'; 
    this.followService.getFollowersForVendor(currentVendorId).subscribe({
      next: (data) => this.followers = data,
      error: (err) => console.error(err)
    });
  }
}
