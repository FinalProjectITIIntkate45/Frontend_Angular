import { Component, OnInit } from '@angular/core';

import { ShopViewModel } from '../../Models/shop.model';
import { ShopService } from '../../Services/Shop.service';


@Component({
  selector: 'app-shops',
  standalone: false,
  templateUrl: './shops.component.html',
  styleUrls: ['./Shops.component.css'],
})
export class ShopsComponent implements OnInit {
  loading: boolean = true;
  error: string | null = null;
  shops!: ShopViewModel[];
  Math: any;

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.loadShops();
  }

  loadShops(): void {
    this.shopService.getAllShops().subscribe({
      next: (shops) => {
        console.log(shops);

        this.shops = shops;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load shops. Please try again later.';
        this.loading = false;
        console.error('Error fetching shops:', err);
      },
    });
  }
}
