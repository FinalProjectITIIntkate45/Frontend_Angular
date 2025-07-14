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

  // ترتيب الإشعارات بالأحدث في الأعلى
  get notificationsSorted() {
    return [...this.notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

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
      case 1: return 'Unread';
      case 2: return 'Read';
      case 3: return 'Archived';
      default: return 'Unknown';
    }
  }

  markNotificationAsRead(notification: NotificationModel) {
    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.status = 2; // Marked as read
      },
      error: () => {
        alert('An error occurred while marking the notification as read');
      }
    });
  }
}

