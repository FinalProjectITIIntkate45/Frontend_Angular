import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Services/home.service';
import { BestSellers } from '../../Models/home-dashboard.model';

@Component({
  selector: 'app-Best-Seller',
  templateUrl: './Best-Seller.component.html',
  styleUrls: ['./Best-Seller.component.css'],
  standalone: false,
})
export class BestSellerComponent implements OnInit {
  bestSellerProducts: BestSellers[] = [];
  showMore = false;
  isLoading = true; // Added loading state

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.getBestSellers();
  }

  getBestSellers() {
    this.isLoading = true; // Show loader before fetching data
    this.homeService.getDashboardData().subscribe({
      next: (data) => {
        console.log('Dashboard Data (Best Sellers):', data);
        this.bestSellerProducts = data?.BestSellers || [];
        this.isLoading = false; // Hide loader after data is fetched
      },
      error: (err) => {
        console.error('Error loading best sellers:', err);
        this.isLoading = false; // Hide loader on error
      }
    });
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }
}