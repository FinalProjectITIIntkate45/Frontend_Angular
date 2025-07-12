// Make sure to install @microsoft/signalr: npm install @microsoft/signalr
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { NewProductNotificationViewModel } from '../models/NewProductNotificationViewModel';
import { APIResponse } from '../models/APIResponse';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection: signalR.HubConnection | undefined;
  private newProductSubject = new Subject<
    APIResponse<NewProductNotificationViewModel>
  >();
  newProduct$ = this.newProductSubject.asObservable();
  private baseUrl = environment.apiUrl;

  public startConnection(): void {
    if (this.hubConnection) return;

    // Fix: Remove the extra /api/ from the URL construction
    const hubUrl = `${this.baseUrl.replace('/api', '')}/api/productHub`;

    console.log('Starting SignalR connection to:', hubUrl);

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem('auth_token') || '',
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connected successfully');
        console.log(
          'Token used for connection:',
          localStorage.getItem('auth_token')?.substring(0, 20) + '...'
        );
      })
      .catch((err: unknown) => {
        console.error('SignalR Connection Error:', err);
        console.error('Connection URL:', hubUrl);
        console.error('Token available:', !!localStorage.getItem('auth_token'));
      });

    this.hubConnection.on(
      'ReceiveNewProductFromFollowedProvider',
      (data: APIResponse<NewProductNotificationViewModel>) => {
        console.log('Received new product notification:', data);
        this.newProductSubject.next(data);
      }
    );

    // Add connection state logging
    this.hubConnection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
    });

    this.hubConnection.onreconnected(() => {
      console.log('SignalR reconnected');
    });

    this.hubConnection.onclose(() => {
      console.log('SignalR connection closed');
    });
  }

  public stopConnection(): void {
    this.hubConnection?.stop();
    this.hubConnection = undefined;
  }
}
