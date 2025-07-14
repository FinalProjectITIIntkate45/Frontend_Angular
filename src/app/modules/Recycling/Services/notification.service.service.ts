import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

export interface NotificationModel {
  id: number;
  message: string;
  status: number;
  notificationType: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;
  private notificationsSubject = new BehaviorSubject<NotificationModel[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private cookieService: CookieService, private http: HttpClient) {}

  // جلب النوتيفيكيشنز القديمة من الـ API
  fetchInitialNotifications() {
    return this.http.get<any[]>('http://localhost:5037/api/Notification/my')
      .subscribe((notifications) => {
        const mapped = notifications.map(n => ({
          id: n.Id,
          message: n.Message,
          status: n.Status,
          notificationType: n.NotificationType,
          createdAt: n.CreatedAt
        }));
        this.notificationsSubject.next([...mapped]);
      });
  }

  connect() {
    const token = this.cookieService.get('auth_token');
    if (!token) {
      console.error('❌ No token found in cookies');
      return;
    }
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5037/notificationHub', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();
    this.hubConnection
      .start()
      .then(() => {
        console.log('🔗 SignalR connected with cookie token');
      })
      .catch((err) => {
        console.error('❌ SignalR connection error:', err);
      });
    this.hubConnection.on('MessageFromMvc', (data: NotificationModel) => {
      const current = this.notificationsSubject.value;
      const isDuplicate = current.some(
        n => n.message === data.message && n.status === data.status && n.notificationType === data.notificationType
      );
      if (!isDuplicate) {
        this.push(data);
      }
    });
  }

  private push(notification: NotificationModel) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...current]);
  }

  getNotifications(): Observable<NotificationModel[]> {
    return this.notifications$;
  }

  markAsRead(notificationId: number) {
    return this.http.patch(`http://localhost:5037/api/Notification/${notificationId}/mark-read`, {});
  }

  disconnect() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
