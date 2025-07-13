import { Component, OnInit } from '@angular/core';
import { FollowSellerService } from '../../Services/follow-seller.service';
import { FollowedSeller } from '../../Models/FollowedSeller.model';
import { APIResponse } from '../../../../core/models/APIResponse';
import { FollowerViewModel } from '../../Models/FollowerViewModel.model';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css'],
  standalone: false,
})
export class FollowersComponent implements OnInit {
  followers: FollowerViewModel[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private followService: FollowSellerService) {}

  ngOnInit(): void {
    this.loadFollowers();
  }

  loadFollowers() {
    this.loading = true;
    this.error = null;

    this.followService.getMyFollowers().subscribe({
      next: (res: APIResponse<FollowerViewModel[]>) => {
        this.loading = false;
        if (res.IsSuccess) {
          this.followers = res.Data;
        } else {
          this.followers = [];
          this.error = res.Message || 'Failed to load followers';
        }
      },
      error: (err) => {
        this.loading = false;
        this.followers = [];
        this.error = 'Failed to load followers';
      },
    });
  }
}
