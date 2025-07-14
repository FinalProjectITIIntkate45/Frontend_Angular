import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Services/home.service';
import { TopProduct } from '../../Models/home-dashboard.model';

@Component({
  selector: 'app-top-rated',
  templateUrl: './Top-Rated.component.html',
  styleUrls: ['./Top-Rated.component.css'],
  standalone: false,
})
export class TopRatedComponent implements OnInit {
  topRatedProducts: TopProduct[] = [];
  showMore = false;
  isLoading = true; // Added loading state

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.getTopRatedProducts();
  }

  getTopRatedProducts() {
    this.isLoading = true; // Show loader before fetching data
    this.homeService.getDashboardData().subscribe({
      next: (data) => {
        console.log('Dashboard Data:', data);
        this.topRatedProducts = data?.TopProducts || [];
        console.log('Top Rated:', this.topRatedProducts);
        this.isLoading = false; // Hide loader after data is fetched
      },
      error: (error) => {
        console.error('Error fetching top rated products:', error);
        this.isLoading = false; // Hide loader on error
      }
    });
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }
}