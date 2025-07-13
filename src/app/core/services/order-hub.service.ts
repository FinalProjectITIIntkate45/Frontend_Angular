// src/app/core/services/order-hub.service.ts
import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

  private orderUpdatesSubject = new BehaviorSubject<OrderUpdate | null>(null);
  public orderUpdates$: Observable<OrderUpdate | null> =
    this.orderUpdatesSubject.asObservable();

  constructor(private ngZone: NgZone) {}

  public startConnection(groupName?: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/orderHub`, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ SignalR OrderHub connected');

        // انضم للجروب بعد الاتصال
        if (groupName) {
          this.joinGroup(groupName);
        }

        // اعادة الانضمام عند reconnect
        this.hubConnection.onreconnected(() => {
          console.log('🔄 SignalR reconnected');
          if (groupName) {
            this.joinGroup(groupName);
          }
        });
      })
      .catch((err) =>
        console.error('❌ Error while starting SignalR connection: ', err)
      );

    // استقبال الرسائل
    this.hubConnection.on('ReceiveOrderUpdate', (data: OrderUpdate) => {
      console.log('📡 Received update:', data);
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
          console.error('❌ Error stopping SignalR connection:', err)
        );
    }
  }

  public joinGroup(groupName: string): void {
    if (
      !this.hubConnection ||
      this.hubConnection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error('⚠️ Cannot join group: not connected yet');
      return;
    }

    this.hubConnection
      .invoke('JoinGroup', groupName)
      .catch((err) =>
        console.error(`❌ Error joining group ${groupName}:`, err)
      );
  }

  public leaveGroup(groupName: string): void {
    if (
      !this.hubConnection ||
      this.hubConnection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error('⚠️ Cannot leave group: not connected yet');
      return;
    }

    this.hubConnection
      .invoke('LeaveGroup', groupName)
      .catch((err) =>
        console.error(`❌ Error leaving group ${groupName}:`, err)
      );
  }
}
