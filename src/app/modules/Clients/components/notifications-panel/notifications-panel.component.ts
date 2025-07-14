import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  NotificationSignalRService,
  NewProductNotification,
} from '../../../../core/services/notification-signalr.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.css'],
  standalone: false,
})
export class ClientNotificationsPanelComponent implements OnInit, OnDestroy {
  notifications: NewProductNotification[] = [];
  private signalRSub?: Subscription;
  private notificationsSub?: Subscription;

  constructor(
    private notificationSignalRService: NotificationSignalRService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Start the connection and handle the promise
    this.notificationSignalRService.startConnection().catch((error) => {
      console.error('Failed to start Notification SignalR connection:', error);
    });

    // Subscribe to persistent notifications
    this.notificationsSub =
      this.notificationSignalRService.notifications$.subscribe(
        (notifications: NewProductNotification[]) => {
          this.notifications = notifications;
        }
      );

    // Subscribe to new notifications for toast alerts
    this.signalRSub = this.notificationSignalRService.newProduct$.subscribe(
      (data: NewProductNotification) => {
        // Show toast notification
        this.toastr.success(
          `New product: ${data.productName} from ${data.shopName}`,
          'New Product Available!',
          {
            timeOut: 5000,
            extendedTimeOut: 2000,
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
          }
        );
      },
      (error: any) => {
        console.error('Error in notification subscription:', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.signalRSub?.unsubscribe();
    this.notificationsSub?.unsubscribe();
    // Don't stop the connection when this component is destroyed
    // The connection should persist for notifications across the app
    // Only stop if the user logs out or the app is closed
  }

  clearNotifications(): void {
    this.notificationSignalRService.clearNotifications();
  }

  removeNotification(index: number): void {
    this.notificationSignalRService.removeNotification(index);
  }
}
