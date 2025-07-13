
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

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.getTopRatedProducts();
  }

  getTopRatedProducts() {
  this.homeService.getDashboardData().subscribe((data) => {

    console.log('Dashboard Data:', data);
    
    this.topRatedProducts = data?.TopProducts || [];
    console.log('Top Rated:', this.topRatedProducts);
  });
}

  toggleShowMore() {
    this.showMore = !this.showMore;
  }
}
