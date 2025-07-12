import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { APIResponse } from '../../../../core/models/APIResponse';
import { NewProductNotificationViewModel } from '../../../../core/models/NewProductNotificationViewModel';
import { SignalRService } from '../../../../core/services/signalr.service';

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.css'],
  standalone: false,
})
export class NotificationsPanelComponent implements OnInit, OnDestroy {
  notifications: APIResponse<NewProductNotificationViewModel>[] = [];
  private signalRSub?: Subscription;

  constructor(private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.signalRSub = this.signalRService.newProduct$.subscribe(
      (data: APIResponse<NewProductNotificationViewModel>) => {
        this.notifications.unshift(data);
      }
    );
  }

  ngOnDestroy(): void {
    this.signalRSub?.unsubscribe();
    this.signalRService.stopConnection();
  }
}
