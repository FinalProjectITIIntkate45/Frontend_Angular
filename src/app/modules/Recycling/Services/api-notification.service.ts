import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

export interface ApiNotificationDTO {
  id: number;
  message: string;
  status: NotificationStatus;
  notificationType: NotificationType;
  referenceId: string;
  createdAt: Date;
}

export enum NotificationStatus {
  Unread = 'Unread',
  Read = 'Read'
}

export enum NotificationType {
  Order = 'Order',
  Payment = 'Payment',
  System = 'System',
  Offer = 'Offer',
  Auction = 'Auction'
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiNotificationService {
  private apiUrl = `${environment.apiUrl}/api/Notification`;
  private notificationsSubject = new BehaviorSubject<ApiNotificationDTO[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.cookieService.get('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Fetch all notifications for the current user
   */
  getMyNotifications(): Observable<ApiNotificationDTO[]> {
    return this.http.get<ApiNotificationDTO[]>(`${this.apiUrl}/my`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Load notifications and update the subject
   */
  loadNotifications(): void {
    this.getMyNotifications().subscribe({
      next: (notifications) => {
        this.notificationsSubject.next(notifications);
        console.log('📋 Loaded notifications from API:', notifications);
      },
      error: (error) => {
        console.error('❌ Error loading notifications:', error);
        this.notificationsSubject.next([]);
      }
    });
  }

  /**
   * Mark a specific notification as read
   */
  markAsRead(notificationId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${notificationId}/mark-read`, {}, {
      headers: this.getHeaders()
    });
  }

  /**
   * Mark notification as read and update local state
   */
  markNotificationAsRead(notificationId: number): void {
    this.markAsRead(notificationId).subscribe({
      next: (response) => {
        console.log('✅ Notification marked as read:', response);
        // Update local state
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, status: NotificationStatus.Read }
            : notification
        );
        this.notificationsSubject.next(updatedNotifications);
      },
      error: (error) => {
        console.error('❌ Error marking notification as read:', error);
      }
    });
  }

  /**
   * Delete a specific notification
   */
  deleteNotification(notificationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${notificationId}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Delete notification and update local state
   */
  deleteNotificationById(notificationId: number): void {
    this.deleteNotification(notificationId).subscribe({
      next: (response) => {
        console.log('🗑️ Notification deleted:', response);
        // Remove from local state
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.filter(
          notification => notification.id !== notificationId
        );
        this.notificationsSubject.next(updatedNotifications);
      },
      error: (error) => {
        console.error('❌ Error deleting notification:', error);
      }
    });
  }

  /**
   * Delete all notifications for the current user
   */
  deleteAllNotifications(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Clear all notifications and update local state
   */
  clearAllNotifications(): void {
    this.deleteAllNotifications().subscribe({
      next: (response) => {
        console.log('🗑️ All notifications cleared:', response);
        this.notificationsSubject.next([]);
      },
      error: (error) => {
        console.error('❌ Error clearing notifications:', error);
      }
    });
  }

  /**
   * Get current notifications from subject
   */
  getCurrentNotifications(): ApiNotificationDTO[] {
    return this.notificationsSubject.value;
  }

  /**
   * Get unread notifications count
   */
  getUnreadCount(): number {
    return this.notificationsSubject.value.filter(
      notification => notification.status === NotificationStatus.Unread
    ).length;
  }

  /**
   * Refresh notifications from API
   */
  refreshNotifications(): void {
    this.loadNotifications();
  }
} 