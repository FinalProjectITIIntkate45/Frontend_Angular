import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Services/home.service';
import { FeaturedShop } from '../../Models/home-dashboard.model';

@Component({
  selector: 'app-Best-shop',
  templateUrl: './Best-shop.component.html',
  styleUrls: ['./Best-shop.component.css'],
  standalone: false,
})
export class BestShopComponent implements OnInit {
  FeaturedShops: FeaturedShop[] = [];
  isLoading = true; // Added loading state

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.getFeaturedShops();
  }

  getFeaturedShops() {
    this.isLoading = true; // Show loader before fetching data
    this.homeService.getDashboardData().subscribe({
      next: (response) => {
        this.FeaturedShops = response.FeaturedShops || [];
        this.isLoading = false; // Hide loader after data is fetched
      },
      error: (err) => {
        console.error('Error loading featured shops:', err);
        this.isLoading = false; // Hide loader on error
      }
    });
  }
}