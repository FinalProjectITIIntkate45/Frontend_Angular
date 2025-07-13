import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home/Services/home.service';
import { HomeDashboard, TopProduct, FeaturedShop, ShopType } from '../home/Models/home-dashboard.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  dashboardData!: HomeDashboard;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getDashboardData().subscribe((data) => {
      this.dashboardData = data;
    });
  }
}
