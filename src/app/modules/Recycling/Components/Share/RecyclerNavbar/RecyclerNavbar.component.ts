import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../../core/services/Auth.service';
import { NotificationModel, NotificationService } from '../../../Services/notification.service.service';
import { WalletService } from '../../../Services/wallet.service';
import { RecyclerService } from '../../../Services/recycler.service';
import { Wallet } from '../../../../../core/models/wallet.model';
import { RecyclerVM } from '../../../Models/RecyclerVM';
import { APIResponse } from '../../../../../core/models/APIResponse';

@Component({
  selector: 'app-RecyclerNavbar',
  templateUrl: './RecyclerNavbar.component.html',
  styleUrls: ['./RecyclerNavbar.component.css'],
  standalone: false
})
export class RecyclerNavbarComponent implements OnInit, OnDestroy {
  // Notification properties
  showNotificationPanel = false;
  notifications: NotificationModel[] = [];
  notificationCount = 0;
  private notificationSub!: Subscription;

  // Wallet properties
  wallet: Wallet | null = null;
  walletLoading: boolean = false;
  private walletSub!: Subscription;

  // Recycler properties
  recycler: RecyclerVM | null = null;
  recyclerLoading: boolean = false;
  private recyclerSub!: Subscription;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private walletService: WalletService,
    private recyclerService: RecyclerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.connectNotificationService();
    this.loadWallet();
    this.loadRecyclerData();
  }

  ngOnDestroy() {
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
    if (this.walletSub) {
      this.walletSub.unsubscribe();
    }
    if (this.recyclerSub) {
      this.recyclerSub.unsubscribe();
    }
  }

  connectNotificationService() {
    this.notificationService.connect(); // بدون userId الآن لأنه بيستخرج من JWT داخليًا
  
    this.notificationSub = this.notificationService.notifications$.subscribe(
      (notifications: NotificationModel[]) => {
        this.notifications = notifications;
        this.notificationCount = notifications.length;
      }
    );
  }
  
  loadWallet() {
    this.walletLoading = true;
    this.walletSub = this.walletService.getUserWallet().subscribe({
      next: (wallet) => {
        this.wallet = wallet;
        this.walletLoading = false;
      },
      error: (error) => {
        console.error('Error loading wallet:', error);
        this.walletLoading = false;
      }
    });
  }

  loadRecyclerData() {
    this.recyclerLoading = true;
    this.recyclerSub = this.recyclerService.getCurrentRecycler().subscribe({
      next: (response: APIResponse<RecyclerVM>) => {
        if (response.IsSuccess) {
          this.recycler = response.Data;
        } else {
          console.error('Error loading recycler data:', response.Message);
        }
        this.recyclerLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading recycler data:', error);
        this.recyclerLoading = false;
      }
    });
  }

  toggleNotificationPanel() {
    this.showNotificationPanel = !this.showNotificationPanel;
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      // Disconnect notification service
      this.notificationService.disconnect();
      
      // Use the auth service to logout
      this.authService.logout();
    }
  }

  clearNotifications() {
    if (confirm('Do you want to clear all notifications?')) {
      this.notifications = [];
      this.notificationCount = 0;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatPoints(points: number): string {
    return new Intl.NumberFormat('en-US').format(points);
  }

  refreshWallet() {
    this.loadWallet();
  }

  refreshRecyclerData() {
    this.loadRecyclerData();
  }

  getRecyclerStatusClass(): string {
    if (!this.recycler) return '';
    
    if (this.recycler.isdeleted) return 'deleted';
    if (!this.recycler.ispaid) return 'unpaid';
    return 'active';
  }

  getRecyclerStatusText(): string {
    if (!this.recycler) return '';
    
    if (this.recycler.isdeleted) return 'Deleted';
    if (!this.recycler.ispaid) return 'Unpaid';
    return 'Active';
  }
}
