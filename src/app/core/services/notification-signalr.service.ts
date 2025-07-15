import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';

export interface NewProductNotification {
  providerId: string;
  productId: number;
  productName: string;
  productPrice: number;
  shopName: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationSignalRService {
  private hubConnection: signalR.HubConnection | undefined;
  private newProductSubject = new Subject<NewProductNotification>();
  public newProduct$ = this.newProductSubject.asObservable();

  // Persistent storage for notifications
  private notificationsSubject = new BehaviorSubject<NewProductNotification[]>(
    []
  );
  public notifications$ = this.notificationsSubject.asObservable();

  private connectionPromise: Promise<void> | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000; // 2 seconds

  private readonly STORAGE_KEY = 'product_notifications';

  constructor() {
    // Listen for logout events to stop connections
    window.addEventListener('userLogout', () => {
      this.stopConnection();
      this.clearNotifications(); // Clear notifications on logout
    });

    // Load notifications from storage on service initialization
    this.loadNotificationsFromStorage();
  }

  private baseUrl = environment.apiUrl;

  // Load notifications from localStorage
  private loadNotificationsFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const notifications = JSON.parse(stored) as NewProductNotification[];
        this.notificationsSubject.next(notifications);
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
    }
  }

  // Save notifications to localStorage
  private saveNotificationsToStorage(
    notifications: NewProductNotification[]
  ): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }

  // Add a new notification
  private addNotification(notification: NewProductNotification): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [notification, ...currentNotifications];
    // Keep only the last 50 notifications to prevent storage bloat
    const trimmedNotifications = updatedNotifications.slice(0, 50);
    this.notificationsSubject.next(trimmedNotifications);
    this.saveNotificationsToStorage(trimmedNotifications);
  }

  // Clear all notifications
  public clearNotifications(): void {
    this.notificationsSubject.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Remove a specific notification
  public removeNotification(index: number): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(
      (_, i) => i !== index
    );
    this.notificationsSubject.next(updatedNotifications);
    this.saveNotificationsToStorage(updatedNotifications);
  }

  // Get current notifications
  public getNotifications(): NewProductNotification[] {
    return this.notificationsSubject.value;
  }

  public startConnection(): Promise<void> {
    // If already connected, return existing promise
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      return Promise.resolve();
    }

    // If connecting, return the existing promise
    if (this.isConnecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    // If connection exists but not connected, stop it first
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = undefined;
    }

    this.isConnecting = true;
    const hubUrl = `${this.baseUrl.replace('/api', '')}/followersHub`;
    const token = localStorage.getItem('auth_token');

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token || '',
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Better reconnection strategy
      .build();

    // Set up event handlers
    this.setupEventHandlers();

    // Start connection
    this.connectionPromise = this.hubConnection
      .start()
      .then(() => {
        this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
        this.testConnection();
        this.isConnecting = false;
      })
      .catch((err: unknown) => {
        console.error('SignalR Connection Error:', err);
        this.isConnecting = false;
        this.connectionPromise = null;
        throw err;
      });

    return this.connectionPromise;
  }

  private setupEventHandlers(): void {
    if (!this.hubConnection) return;

    // Handle new product notifications
    this.hubConnection.on(
      'ReceiveNewProductNotification',
      (data: NewProductNotification) => {
        // Add to persistent storage
        this.addNotification(data);

        // Emit to subscribers
        this.newProductSubject.next(data);
      }
    );

    // Handle connection test
    this.hubConnection.on('ConnectionTest', (message: string) => {
      // Connection test received
    });

    // Connection state handlers
    this.hubConnection.onreconnecting(() => {
      this.reconnectAttempts++;
    });

    this.hubConnection.onreconnected(() => {
      this.reconnectAttempts = 0; // Reset on successful reconnection

      // Re-test connection after reconnection
      setTimeout(() => {
        this.testConnection();
      }, 1000);
    });

    this.hubConnection.onclose((error) => {
      this.connectionPromise = null;
      this.isConnecting = false;

      // Don't auto-reconnect if manually stopped
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.startConnection().catch((err) => {
            console.error('Reconnection failed:', err);
          });
        }, this.reconnectDelay);
      }
    });
  }

  private testConnection(): void {
    if (this.hubConnection) {
      this.hubConnection
        .invoke('TestConnection')
        .catch((err) => console.error('Connection test failed:', err));
    }
  }

  public testNotification(): void {
    if (this.hubConnection) {
      this.hubConnection
        .invoke('TestNotification')
        .catch((err) => console.error('Test notification failed:', err));
    }
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = undefined;
      this.connectionPromise = null;
      this.isConnecting = false;
      this.reconnectAttempts = 0; // Reset reconnect attempts
    }
  }

  public isConnected(): boolean {
    return this.hubConnection?.state === signalR.HubConnectionState.Connected;
  }
}
