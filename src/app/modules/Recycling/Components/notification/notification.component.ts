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
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: NotificationModel[] = [];
  private sub!: Subscription;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub = this.notificationService.notifications$.subscribe(
      notis => {
        this.notifications = notis;
      }
    );
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
}

