// src/app/core/services/order-hub.service.ts
import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OrderUpdate {
  orderId: number;
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderHubService {
  private hubConnection!: signalR.HubConnection;

  // BehaviorSubject ليقدر المكونات يشتركوا ويستقبلوا التحديثات
  private orderUpdatesSubject = new BehaviorSubject<OrderUpdate | null>(null);
  public orderUpdates$: Observable<OrderUpdate | null> =
    this.orderUpdatesSubject.asObservable();

  constructor(private ngZone: NgZone) {}

  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('/orderHub') // رابط الهب على السيرفر
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR OrderHub connected'))
      .catch((err) =>
        console.error('Error while starting SignalR connection: ', err)
      );

    // استماع لتحديثات الطلبات من السيرفر
    this.hubConnection.on('ReceiveOrderUpdate', (data: OrderUpdate) => {
      // لتحديث Angular zone لضمان التحديث الصحيح للـ UI
      this.ngZone.run(() => {
        this.orderUpdatesSubject.next(data);
      });
    });
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection
        .stop()
        .catch((err) =>
          console.error('Error stopping SignalR connection:', err)
        );
    }
  }

  // للاشتراك في مجموعة معينة (مثلاً مجموعة المستخدم أو المتجر)
  public joinGroup(groupName: string): void {
    this.hubConnection
      .invoke('JoinGroup', groupName)
      .catch((err) => console.error(`Error joining group ${groupName}:`, err));
  }

  public leaveGroup(groupName: string): void {
    this.hubConnection
      .invoke('LeaveGroup', groupName)
      .catch((err) => console.error(`Error leaving group ${groupName}:`, err));
  }
}
