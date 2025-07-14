import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartServicesService } from '../../../../modules/Clients/Services/CardServices.service';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../../../modules/Clients/Services/wishlist.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemsCount: number = 0;
  wishlistCount: number = 0;
  private cartCountSub?: Subscription;
  private wishlistCountSub?: Subscription;

  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const target = event.target as HTMLInputElement;
      console.log('Search for:', target.value);
      // Add actual search functionality here
    }
  }

  constructor(
    private cartService: CartServicesService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.cartCountSub = this.cartService.cartItemsCount$.subscribe(
      (count: number) => {
        this.cartItemsCount = count;
      }
    );
    this.cartService.refreshCartItemsCount();

    this.wishlistCountSub = this.wishlistService.wishlistCount$.subscribe(
      (count: number) => {
        this.wishlistCount = count;
      }
    );
    this.wishlistService.refreshWishlistCount();
  }

  ngOnDestroy() {
    this.cartCountSub?.unsubscribe();
    this.wishlistCountSub?.unsubscribe();
  }
}
