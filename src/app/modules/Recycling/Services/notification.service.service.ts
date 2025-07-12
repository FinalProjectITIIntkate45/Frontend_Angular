import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

export interface NotificationModel {
  message: string;
  status: string;
  notificationType: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;
  private notificationsSubject = new BehaviorSubject<NotificationModel[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private cookieService: CookieService) {} // ✅ Inject CookieService

  connect() {
    const token = this.cookieService.get('auth_token'); // ✅ Get token from cookies

    if (!token) {
      console.error('❌ No token found in cookies');
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5037/notificationHub', {
        accessTokenFactory: () => token // ✅ Pass the token to SignalR
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('🔗 SignalR connected with cookie token');
  //        const userId = this.authService.getUserId(); // تأكد أنه بيرجع ID من التوكن
  // this.hubConnection.invoke('JoinGroup', userId); // ⚠️ لازم تنضم للجروب ده
      })
      .catch((err) => {
        console.error('❌ SignalR connection error:', err);
      });

      this.hubConnection.on('MessageFromMvc', (data: NotificationModel) => { 
        const current = this.notificationsSubject.value;
        // Check for duplicates by message, status, and notificationType
        const isDuplicate = current.some(
          n => n.message === data.message && n.status === data.status && n.notificationType === data.notificationType
        );
        if (!isDuplicate) {
          console.log('📩 New structured notification:', data);
          this.push(data);
        } else {
          console.log('⚠️ Duplicate notification ignored:', data);
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

  disconnect() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
