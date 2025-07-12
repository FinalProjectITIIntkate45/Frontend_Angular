import { Component, OnInit } from '@angular/core';
import { FollowSellerService } from '../../Services/follow.service';
import { ShopViewModel } from '../../Models/shop-view-model';
import { ShopDetailsModalComponent } from '../shop-details-modal/shop-details-modal.component';
import { AuthService } from '../../../../core/services/Auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-follow-seller',
  templateUrl: './follow-seller.component.html',
  styleUrls: ['./follow-seller.component.css'],
  standalone: false,
})
export class FollowSellerComponent implements OnInit {
  clientId = 'client1';
  followedShops: number[] = [];
  allShops: ShopViewModel[] = [];
  shopSearch: string = '';
  filteredShops: ShopViewModel[] = [];
  showShopModal = false;
  selectedShop: ShopViewModel | null = null;
  loadingShops: Set<number> = new Set(); // Track which shops are being followed/unfollowed

  constructor(
    private followService: FollowSellerService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadFollowedShops();
    this.loadAllShops();
  }

  loadFollowedShops() {
    this.followService.getFollowedShops().subscribe({
      next: (res) => {
        if (res.IsSuccess) {
          this.followedShops = res.Data;
        } else {
          this.followedShops = [];
        }
      },
      error: (err) => {
        this.followedShops = [];
      },
    });
  }

  loadAllShops() {
    this.followService.getAllShops().subscribe({
      next: (res) => {
        if (res.IsSuccess) {
          this.allShops = res.Data;
          this.filteredShops = this.allShops;
        } else {
          this.allShops = [];
          this.filteredShops = [];
          alert(res.Message || 'Failed to load shops');
        }
      },
      error: (err) => {
        this.allShops = [];
        this.filteredShops = [];
        alert(err.error?.Message || 'Failed to load shops');
      },
    });
  }

  filterShops() {
    const search = this.shopSearch.toLowerCase();
    this.filteredShops = this.allShops.filter(
      (shop) =>
        shop.Name.toLowerCase().includes(search) ||
        shop.TypeName.toLowerCase().includes(search) ||
        shop.City.toLowerCase().includes(search)
    );
  }

  viewShop(shop: ShopViewModel) {
    this.selectedShop = shop;
    this.showShopModal = true;
  }

  closeShopModal() {
    this.showShopModal = false;
    this.selectedShop = null;
  }

  isFollowing(shopId: number): boolean {
    return this.followedShops.includes(shopId);
  }

  isLoading(shopId: number): boolean {
    return this.loadingShops.has(shopId);
  }

  follow(shopId: number) {
    // Set loading state
    this.loadingShops.add(shopId);

    // Optimistically update UI
    if (!this.followedShops.includes(shopId)) {
      this.followedShops.push(shopId);
    }

    this.followService.followShop(shopId).subscribe({
      next: (res) => {
        this.loadingShops.delete(shopId);
        if (res.IsSuccess) {
          // Success - keep the optimistic update
          this.toastr.success(
            '🎉 Successfully followed the shop!',
            'Followed!',
            {
              timeOut: 3000,
              progressBar: true,
              closeButton: true,
              positionClass: 'toast-top-right',
              enableHtml: true,
              toastClass: 'custom-toast-success',
            }
          );
        } else {
          // Revert optimistic update on failure
          this.followedShops = this.followedShops.filter((id) => id !== shopId);
          this.toastr.error(res.Message || 'Failed to follow shop', 'Error', {
            timeOut: 4000,
            progressBar: true,
            closeButton: true,
            positionClass: 'toast-top-right',
          });
        }
      },
      error: (err) => {
        this.loadingShops.delete(shopId);
        // Revert optimistic update on error
        this.followedShops = this.followedShops.filter((id) => id !== shopId);
        this.toastr.error(
          err.error?.Message || 'Failed to follow shop',
          'Error',
          {
            timeOut: 4000,
            progressBar: true,
            closeButton: true,
            positionClass: 'toast-top-right',
          }
        );
      },
    });
  }

  unfollow(shopId: number) {
    // Set loading state
    this.loadingShops.add(shopId);

    // Optimistically update UI
    this.followedShops = this.followedShops.filter((id) => id !== shopId);

    this.followService.unfollowShop(shopId).subscribe({
      next: (res) => {
        this.loadingShops.delete(shopId);
        if (res.IsSuccess) {
          // Success - keep the optimistic update
          this.toastr.success(
            '👋 Successfully unfollowed the shop!',
            'Unfollowed!',
            {
              timeOut: 3000,
              progressBar: true,
              closeButton: true,
              positionClass: 'toast-top-right',
              enableHtml: true,
              toastClass: 'custom-toast-success',
            }
          );
        } else {
          // Revert optimistic update on failure
          if (!this.followedShops.includes(shopId)) {
            this.followedShops.push(shopId);
          }
          this.toastr.error(res.Message || 'Failed to unfollow shop', 'Error', {
            timeOut: 4000,
            progressBar: true,
            closeButton: true,
            positionClass: 'toast-top-right',
          });
        }
      },
      error: (err) => {
        this.loadingShops.delete(shopId);
        // Revert optimistic update on error
        if (!this.followedShops.includes(shopId)) {
          this.followedShops.push(shopId);
        }
        this.toastr.error(
          err.error?.Message || 'Failed to unfollow shop',
          'Error',
          {
            timeOut: 4000,
            progressBar: true,
            closeButton: true,
            positionClass: 'toast-top-right',
          }
        );
      },
    });
  }
}
