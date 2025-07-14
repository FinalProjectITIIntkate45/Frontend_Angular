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
  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.homeService.getDashboardData().subscribe(response => {
      this.FeaturedShops = response.FeaturedShops;
    });
  }
}
