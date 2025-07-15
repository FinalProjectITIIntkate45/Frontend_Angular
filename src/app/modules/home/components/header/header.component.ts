import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartServicesService } from '../../../../modules/Clients/Services/CardServices.service';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../../../modules/Clients/Services/wishlist.service';
import { AuthService } from '../../../../core/services/Auth.service';
import { NotificationSignalRService } from '../../../../core/services/notification-signalr.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemsCount: number = 0;
  wishlistCount: number = 0;
  isAuthenticated: boolean = false;
  showNotificationsPanel: boolean = false;
  hasNotifications: boolean = false;
  private cartCountSub?: Subscription;
  private wishlistCountSub?: Subscription;
  private authStateSub?: Subscription;
  private documentClickListener?: EventListener;

  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const target = event.target as HTMLInputElement;
      console.log('Search for:', target.value);
      // Add actual search functionality here
    }
  }

  constructor(
    private cartService: CartServicesService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private notificationSignalRService: NotificationSignalRService
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

    this.authStateSub = this.authService.getAuthState().subscribe((state) => {
      console.log('[HeaderComponent] Auth state changed:', state);
      this.isAuthenticated = state.isAuthenticated;
    });

    this.notificationSignalRService.notifications$.subscribe(
      (notifications) => {
        this.hasNotifications = notifications.length > 0;
      }
    );

    // Listen for clicks outside the notification panel to close it
    this.documentClickListener = this.onDocumentClick.bind(
      this
    ) as EventListener;
    document.addEventListener('click', this.documentClickListener, true);
  }

  toggleNotificationsPanel(event: MouseEvent) {
    event.stopPropagation();
    this.showNotificationsPanel = !this.showNotificationsPanel;
  }

  onDocumentClick(event: MouseEvent) {
    const panel = document.getElementById('notifications-dropdown-panel');
    const bell = document.getElementById('notifications-bell-icon');
    if (this.showNotificationsPanel && panel && bell) {
      if (
        !panel.contains(event.target as Node) &&
        !bell.contains(event.target as Node)
      ) {
        this.showNotificationsPanel = false;
      }
    }
  }

  ngOnDestroy() {
    this.cartCountSub?.unsubscribe();
    this.wishlistCountSub?.unsubscribe();
    this.authStateSub?.unsubscribe();
    if (this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener, true);
    }
  }
}
