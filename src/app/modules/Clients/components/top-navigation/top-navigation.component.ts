import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../../core/services/Auth.service';
import { CartServicesService } from '../../Services/CardServices.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-navigation',
  standalone: false,
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css'],
})
export class TopNavigationComponent implements OnInit, OnDestroy {
  userName: string = '';
  notificationsCount: number = 3;
  cartItemsCount: number = 0;
  private cartCountSub?: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartServicesService
  ) {}

  ngOnInit() {
    // this.authService.getProfile().subscribe((profile: { userName: string }) => {
    //   this.userName = profile.userName || 'User';
    // });
    this.userName = 'User'; // قيمة افتراضية لأغراض العرض
    this.cartCountSub = this.cartService.cartItemsCount$.subscribe((count) => {
      this.cartItemsCount = count;
    });
    this.cartService.refreshCartItemsCount(); // Ensure count is up to date on load
  }

  ngOnDestroy() {
    this.cartCountSub?.unsubscribe();
  }
}
