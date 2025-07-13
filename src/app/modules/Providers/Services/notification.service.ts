import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UnifiedNotification } from '../Models/UnifiedNotification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;

  private notificationsSubject = new BehaviorSubject<UnifiedNotification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private cookieService: CookieService) {}

  connect() {
    const token = this.cookieService.get('auth_token');

    if (!token) {
      console.error('❌ No token found in cookies');
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5037/notificationHub', {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('🔗 SignalR connected');
      })
      .catch((err) => {
        console.error('❌ SignalR connection error:', err);
      });

    this.hubConnection.on('MessageFromMvc', (data: UnifiedNotification) => {
      const current = this.notificationsSubject.value;
      const isDuplicate = current.some(
        (n) =>
          n.message === data.message &&
          n.status === data.status &&
          n.notificationType === data.notificationType
      );

      if (!isDuplicate) {
        const newNotification: UnifiedNotification = {
          ...data,
          isNew: true,
        };
        this.push(newNotification);
      }
    });
  }

  private push(notification: UnifiedNotification) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...current]);
  }

  getNotifications(): Observable<UnifiedNotification[]> {
    return this.notifications$;
  }

  public loadOldNotifications(notifications: UnifiedNotification[]) {
    const current = this.notificationsSubject.value;
    const merged = [...notifications, ...current];
    this.notificationsSubject.next(merged);
  }

  public clearAllNotifications(): void {
    this.notificationsSubject.next([]);
  }

  disconnect() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
