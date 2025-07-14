import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  NotificationSignalRService,
  NewProductNotification,
} from '../../../../core/services/notification-signalr.service';

@Component({
  selector: 'app-user-nav',
  standalone: false,
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css',
})
export class UserNavComponent implements OnInit, OnDestroy {
  showNotifications = false;
  notificationCount = 0;
  private signalRSub?: Subscription;
  private notificationsSub?: Subscription;

  constructor(private notificationSignalRService: NotificationSignalRService) {}

  ngOnInit(): void {
    // Don't start connection here - let the notifications panel handle it
    // Just subscribe to notifications

    // Subscribe to persistent notifications for count
    this.notificationsSub =
      this.notificationSignalRService.notifications$.subscribe(
        (notifications: NewProductNotification[]) => {
          this.notificationCount = notifications.length;
        }
      );

    // Subscribe to new notifications for immediate count updates
    this.signalRSub = this.notificationSignalRService.newProduct$.subscribe(
      (data: NewProductNotification) => {
        // Count will be updated via the notifications$ subscription
      }
    );
  }

  ngOnDestroy(): void {
    this.signalRSub?.unsubscribe();
    this.notificationsSub?.unsubscribe();
    // Don't stop connection here - let the notifications panel handle it
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notificationCount = 0; // Reset count when opening notifications
    }
  }
}
