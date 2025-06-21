import { Component } from '@angular/core';
import { LoaderService } from './core/services/loader.service';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'PointPay';
  userType: string = 'user';
  isLoading: boolean = false;
  constructor(public loaderService: LoaderService) {
    this.loaderService.isloading.subscribe((loading: boolean) => {
      this.isLoading = loading;
      if (loading) {
        console.log('Loading started');
      } else {
        console.log('Loading finished');
      }
    });
    // You can initialize userType based on some logic or service if needed
  }
  setUserType(type: string) {
    this.userType = type;
  }
}
