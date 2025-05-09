import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/Auth.service';

@Component({
  selector: 'app-profile-section',
  standalone:false,
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.css'],
})
export class ProfileSectionComponent implements OnInit {
  profile: any = null;
  ordersCount: number = 3;
  recyclingPoints: number = 320;
  stats = {
    browsedItems: 1230,
    orders: 45,
    favorites: 89,
    reviews: 17,
  };
  rankProgress: number = 32;
  loyaltyProgress: number = 70;
  browsingHistory = [
    { name: "Men's Cotton T-Shirt", category: 'Clothing', icon: 'fas fa-tshirt' },
    { name: 'Smartphone Case', category: 'Electronics', icon: 'fas fa-mobile-alt' },
    { name: 'Kitchen Knife Set', category: 'Home & Kitchen', icon: 'fas fa-utensils' },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getProfile().subscribe((data: any) => {
      this.profile = data;
    });
  }
}
