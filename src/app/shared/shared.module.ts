import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinebreaksPipe } from './pipes/linebreaks.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientNotificationsPanelComponent } from '../modules/Clients/components/notifications-panel/notifications-panel.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [LinebreaksPipe, ClientNotificationsPanelComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    LoaderComponent,
  ],
  exports: [
    LinebreaksPipe,
    ClientNotificationsPanelComponent,
    MatIconModule,
    MatProgressSpinnerModule,
    LoaderComponent,
  ],
})
export class SharedModule {}
