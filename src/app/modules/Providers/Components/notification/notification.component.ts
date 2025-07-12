// notification.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../Services/notification.service';
import { NotificationApiService } from '../../Services/notification-api.service';
import { UnifiedNotification } from '../../Models/UnifiedNotification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  standalone: false,
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: UnifiedNotification[] = [];
  private sub!: Subscription;

  constructor(
    private notificationService: NotificationService,
    private notificationApiService: NotificationApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.notificationApiService.getMyNotifications().subscribe((old) => {
      const formattedOld = old.map((n) => ({
        ...n,
        isNew: false,
      }));
      this.notificationService.loadOldNotifications(formattedOld);
    });

    this.sub = this.notificationService
      .getNotifications()
      .subscribe((notis) => {
        this.notifications = notis;
      });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  openNotification(notification: UnifiedNotification) {
    if (!notification || !notification.referenceId || !notification.id) return;

    this.notificationApiService.markAsRead(notification.id).subscribe(() => {
      notification.isNew = false;
      this.router.navigateByUrl(notification.referenceId!);
    });
  }

  clearNotifications() {
    if (confirm('هل تريد مسح جميع الإشعارات؟')) {
      this.notificationApiService.deleteAllMyNotifications().subscribe(() => {
        this.notificationService.clearAllNotifications();
      });
    }
  }

  getNotificationIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'order':
        return 'fas fa-shopping-cart';
      case 'alert':
        return 'fas fa-exclamation-triangle';
      case 'reminder':
        return 'fas fa-bell';
      case 'system':
        return 'fas fa-cogs';
      case 'point':
        return 'fas fa-star';
      default:
        return 'fas fa-info-circle';
    }
  }

  getNotificationClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'order':
        return 'notification-order';
      case 'alert':
        return 'notification-alert';
      case 'reminder':
        return 'notification-reminder';
      case 'system':
        return 'notification-system';
      case 'point':
        return 'notification-point';
      default:
        return 'notification-default';
    }
  }

  formatType(type: string): string {
    switch (type.toLowerCase()) {
      case 'order':
        return 'طلب جديد';
      case 'alert':
        return 'تنبيه';
      case 'reminder':
        return 'تذكير';
      case 'system':
        return 'إشعار نظام';
      case 'point':
        return 'نقاط مكتسبة';
      default:
        return 'إشعار';
    }
  }
}
