import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserFooterComponent } from './user-footer/user-footer.component'; 
import { UserNavComponent } from './user-nav/user-nav.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserFooterComponent ,UserNavComponent], 
  

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PointPay';
  userType: string = 'user';

  setUserType(type: string) {
    this.userType = type;
  }
}
