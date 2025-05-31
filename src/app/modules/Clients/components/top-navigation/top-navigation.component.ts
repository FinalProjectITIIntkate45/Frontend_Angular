import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/Auth.service';

@Component({
  selector: 'app-top-navigation',
  standalone: false,
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {
  userName: string = '';
  notificationsCount: number = 3;
  cartItemsCount: number = 2;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // this.authService.getProfile().subscribe((profile: { userName: string }) => {
    //   this.userName = profile.userName || 'User';
    // });
    this.userName = 'User'; // قيمة افتراضية لأغراض العرض
  }
}
