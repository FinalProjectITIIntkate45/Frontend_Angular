import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, NotificationModel } from '../../Services/notification.service.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  standalone: false
})
export class NotificationComponent implements OnInit {
  notifications: NotificationModel[] = [];
  private sub!: Subscription;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.notificationService.fetchInitialNotifications();
    this.notificationService.connect();
    this.notificationService.getNotifications().subscribe((notifications) => {
      console.log('Notifications from backend:', notifications); // طباعة الداتا القادمة من الباك اند
      this.notifications = notifications;
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  // Handle section change from RecyclerLayout
  onSectionChange(section: string) {
    console.log('Section changed to:', section);
    // Handle navigation based on section if needed
  }

  clearNotifications() {
    if (confirm('هل تريد مسح جميع الإشعارات؟')) {
      this.notifications = [];
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1: return 'غير مقروءة';
      case 2: return 'مقروءة';
      case 3: return 'مؤرشفة';
      default: return 'غير معروف';
    }
  }

  markNotificationAsRead(notification: NotificationModel) {
    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.status = 2; // مقروءة
      },
      error: () => {
        alert('حدث خطأ أثناء تعليم الإشعار كمقروء');
      }
    });
  }
}

