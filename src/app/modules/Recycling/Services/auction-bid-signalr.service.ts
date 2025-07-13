import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuctionBidSignalrService {
  private hubConnection!: signalR.HubConnection;
  private hubUrl = 'http://localhost:5037/AuctionHub';

  private newBidSubject = new BehaviorSubject<any>(null);
  public newBid$ = this.newBidSubject.asObservable();

  private updateMaxBidSubject = new BehaviorSubject<any>(null);
  public updateMaxBid$ = this.updateMaxBidSubject.asObservable();

  private userBidsSubject = new BehaviorSubject<any>(null);
  public userBids$ = this.userBidsSubject.asObservable();

  constructor(private cookieService: CookieService) {}

  public connect(auctionId: number): void {
    const token =
      this.cookieService.get('auth_token') ||
      localStorage.getItem('token') ||
      '';
    console.log('Token used for SignalR:', token);
    if (!token) {
      console.error('❌ No token found in cookies or localStorage');
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ SignalR connected to AuctionHub');
        this.joinAuctionGroup(auctionId); // انضمام تلقائي بعد الاتصال
      })
      .catch((err) => console.error('❌ SignalR connection failed:', err));

    this.hubConnection.onclose((error) => {
      console.error('❌ SignalR connection closed!', error?.message || error);
    });

    this.hubConnection.on('NewBid', (data) => {
      console.log('📡 [SignalR] Received NewBid:', data);
      this.newBidSubject.next(data);
    });

    this.hubConnection.on('NewMaxBid', (data) => {
      console.log('📡 [SignalR] Received NewMaxBid:', data);
      this.updateMaxBidSubject.next(data);
    });

    this.hubConnection.on('AllUserBidByAuction', (data) => {
      console.log('📡 [SignalR] Received AllUserBidByAuction:', data);
      this.userBidsSubject.next(data);
    });
  }

  public disconnect(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  public joinAuctionGroup(auctionId: number): void {
    if (this.hubConnection) {
      this.hubConnection
        .invoke('JoinAuctionRoom', auctionId.toString())
        .catch((err) => console.error('❌ Failed to join group:', err));
    }
  }

  public leaveAuctionGroup(auctionId: number): void {
    if (this.hubConnection) {
      this.hubConnection
        .invoke('LeaveAuctionRoom', auctionId.toString())
        .catch((err) => console.error('❌ Failed to leave group:', err));
    }
  }
}
