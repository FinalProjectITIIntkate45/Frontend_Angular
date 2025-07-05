import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../modules/auth/services/account.service';
import { ProfileViewModel } from '../../../../modules/Clients/Models/profile-view.model';

@Component({
  selector: 'app-profile-section',
  standalone:false,
  templateUrl:'./profile-section.component.html',
  styleUrls: ['./profile-section.component.css'],
})
export class ProfileSectionComponent implements OnInit {
  profileData: ProfileViewModel | null = null;
  error: string | null = null;
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

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.getProfile().subscribe({
      next: (data) => {
        this.profileData = data;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to load profile.';
        this.profileData = null;
      }
    });
  }
}
