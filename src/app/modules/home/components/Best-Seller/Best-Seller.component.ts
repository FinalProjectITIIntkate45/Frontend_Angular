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

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.getBestSellers();
  }

  getBestSellers() {
    this.homeService.getDashboardData().subscribe((data) => {
      console.log('Dashboard Data (Best Sellers):', data);
      this.bestSellerProducts = data?.BestSellers || [];
    });
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }
}
