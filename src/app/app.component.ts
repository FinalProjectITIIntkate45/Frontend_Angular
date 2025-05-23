import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'PointPay';
  userType: string = 'user';

  setUserType(type: string) {
    this.userType = type;
  }
}
