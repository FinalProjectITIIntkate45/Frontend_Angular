import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-product-navbar',
  templateUrl: './product-navbar.component.html',
  styleUrls: ['./product-navbar.component.css'],
  standalone: false,
})
export class ProductNavbarComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  cartCount: number = 0;
  wishlistCount: number = 0;

  private routeSubscription?: Subscription;
  private navigationSubscription?: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Initialize cart and wishlist counts
    this.loadCartCount();
    this.loadWishlistCount();

    // Listen to navigation events to get the current route's query parameters
    this.navigationSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Get the activated route (the current route)
        let currentRoute = this.route;
        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }

        // Subscribe to query parameters of the current route
        this.subscribeToQueryParams(currentRoute);
      });

    // Initial subscription for current route
    this.subscribeToQueryParams(this.route);
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  private subscribeToQueryParams(route: ActivatedRoute) {
    // Unsubscribe from previous subscription if exists
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }

    // Subscribe to query parameters
    this.routeSubscription = route.queryParams.subscribe((params) => {
      const searchParam = params['search'] || '';
      // Only update if the search query actually changed
      if (this.searchQuery !== searchParam) {
        this.searchQuery = searchParam;
      }
    });
  }

  performSearch() {
    const trimmedQuery = this.searchQuery.trim();

    if (trimmedQuery) {
      // Check if we're already on products page
      if (this.router.url.includes('/client/products')) {
        // We're on products page, update query params
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { search: trimmedQuery },
          queryParamsHandling: 'merge',
        });
      } else {
        // Navigate to products page with search query
        this.router.navigate(['/client/products'], {
          queryParams: { search: trimmedQuery },
        });
      }
    } else {
      // Handle empty search
      if (this.router.url.includes('/client/products')) {
        // Clear search query parameter
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { search: null },
          queryParamsHandling: 'merge',
        });
      } else {
        // Navigate to products page without search
        this.router.navigate(['/client/products']);
      }
    }
  }

  onSearchInputChange() {
    // This method can be used for real-time search suggestions if needed
    // For now, it's just a placeholder
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.router.url.includes('/client/products')) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: null },
        queryParamsHandling: 'merge',
      });
    }
  }

  private loadCartCount() {
    // TODO: Implement cart service integration
    // Example:
    // this.cartService.getCartItemsCount().subscribe(count => {
    //   this.cartCount = count;
    // });

    // Placeholder - replace with actual cart service
    this.cartCount = 0;
  }

  private loadWishlistCount() {
    // TODO: Implement wishlist service integration
    // Example:
    // this.wishlistService.getWishlistItemsCount().subscribe(count => {
    //   this.wishlistCount = count;
    // });

    // Placeholder - replace with actual wishlist service
    this.wishlistCount = 0;
  }

  toggleTheme() {
    // TODO: Implement theme switching logic
    console.log('Theme toggle clicked');
  }

  toggleUserMenu() {
    // TODO: Implement user menu toggle
    console.log('User menu clicked');
  }

  toggleCategories() {
    // TODO: Implement categories dropdown toggle
    console.log('Categories dropdown clicked');
  }

  toggleSettings() {
    // TODO: Implement settings dropdown toggle
    console.log('Settings dropdown clicked');
  }

  navigateToCart() {
    this.router.navigate(['/client/cart']);
  }

  navigateToWishlist() {
    this.router.navigate(['/client/wishlist']);
  }

  navigateToAccount() {
    this.router.navigate(['/client/profile']);
  }

  navigateToHome() {
    this.router.navigate(['/client']);
  }

  navigateToShop() {
    this.router.navigate(['/client/products']);
  }

  // Helper method to check if current route is active
  isRouteActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}
