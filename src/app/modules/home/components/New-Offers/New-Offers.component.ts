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

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getDashboardData().subscribe({
      next: (res) => {
        this.offers = res.Offers;
      },
      error: (err) => {
        console.error('Error loading offers:', err);
      }
    });
  }
}
