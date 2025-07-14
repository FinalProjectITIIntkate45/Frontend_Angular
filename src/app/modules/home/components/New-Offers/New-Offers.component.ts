import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Services/home.service';
import { Offers } from '../../Models/home-dashboard.model';

@Component({
  selector: 'app-New-Offers',
  templateUrl: './New-Offers.component.html',
  styleUrls: ['./New-Offers.component.css'],
  standalone: false,
})
export class NewOffersComponent implements OnInit {
  offers: Offers[] = [];
  isLoading = true; // Added loading state

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.getOffers();
  }

  getOffers() {
    this.isLoading = true; // Show loader before fetching data
    this.homeService.getDashboardData().subscribe({
      next: (res) => {
        this.offers = res.Offers || [];
        this.isLoading = false; // Hide loader after data is fetched
      },
      error: (err) => {
        console.error('Error loading offers:', err);
        this.isLoading = false; // Hide loader on error
      }
    });
  }
}