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
  private hubConnection: signalR.HubConnection | undefined;
  private orderUpdatesSubject = new BehaviorSubject<OrderUpdate | null>(null);
  public orderUpdates$: Observable<OrderUpdate | null> =
    this.orderUpdatesSubject.asObservable();
  private connectionPromise: Promise<void> | null = null;
  private isConnecting = false;

  constructor(private ngZone: NgZone) {
    // Listen for logout events to stop connections
    window.addEventListener('userLogout', () => {
      this.stopConnection();
    });
  }

  public startConnection(groupName?: string): Promise<void> {
    // If already connected, return existing promise
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      console.log('✅ OrderHub already connected');
      if (groupName) {
        this.joinGroup(groupName);
      }
      return Promise.resolve();
    }

    // If connecting, return the existing promise
    if (this.isConnecting && this.connectionPromise) {
      console.log('🔄 OrderHub connection already in progress');
      return this.connectionPromise;
    }

    // If connection exists but not connected, stop it first
    if (this.hubConnection) {
      console.log('🔄 Stopping existing OrderHub connection before restarting');
      this.hubConnection.stop();
      this.hubConnection = undefined;
    }

    this.isConnecting = true;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/orderHub`, {
        accessTokenFactory: () => localStorage.getItem('auth_token') || '',
      })
      .withAutomaticReconnect()
      .build();

    // Set up event handlers
    this.setupEventHandlers();

    // Start connection
    this.connectionPromise = this.hubConnection
      .start()
      .then(() => {
        console.log('✅ SignalR OrderHub connected');

        // Join group after connection
        if (groupName) {
          this.joinGroup(groupName);
        }

        this.isConnecting = false;
      })
      .catch((err) => {
        console.error('❌ Error while starting SignalR connection: ', err);
        this.isConnecting = false;
        this.connectionPromise = null;
        throw err;
      });

    return this.connectionPromise;
  }

  private setupEventHandlers(): void {
    if (!this.hubConnection) return;

    // Handle order updates
    this.hubConnection.on('ReceiveOrderUpdate', (data: OrderUpdate) => {
      console.log('📡 Received order update:', data);
      this.ngZone.run(() => {
        this.orderUpdatesSubject.next(data);
      });
    });

    // Connection state handlers
    this.hubConnection.onreconnecting(() => {
      console.log('🔄 OrderHub reconnecting...');
    });

    this.hubConnection.onreconnected(() => {
      console.log('✅ OrderHub reconnected');
    });

    this.hubConnection.onclose((error) => {
      console.log('❌ OrderHub connection closed');
      if (error) {
        console.error('❌ OrderHub connection close error:', error);
      }
      this.connectionPromise = null;
      this.isConnecting = false;
    });
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = undefined;
      this.connectionPromise = null;
      this.isConnecting = false;
      console.log('🛑 OrderHub connection stopped');
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
      .then(() => console.log(`✅ Joined OrderHub group: ${groupName}`))
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
      .then(() => console.log(`✅ Left OrderHub group: ${groupName}`))
      .catch((err) =>
        console.error(`❌ Error leaving group ${groupName}:`, err)
      );
  }

  public isConnected(): boolean {
    return this.hubConnection?.state === signalR.HubConnectionState.Connected;
  }
}
