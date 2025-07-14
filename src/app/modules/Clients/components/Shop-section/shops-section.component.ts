import { Component, OnInit } from '@angular/core';

import { ShopViewModel } from '../../Models/shop-view-model';
import { ShopService } from '../../Services/shop.service';

@Component({
  selector: 'app-shops-section',
  standalone: false,
  templateUrl: './shops-section.component.html',
  styleUrls: ['./shops-section.component.css'],
})
export class ShopsSectionComponent implements OnInit {
  loading: boolean = true;
  error: string | null = null;
  shops!: ShopViewModel[];
  Math: any;

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.loadAllShops();
  }

  // loadShops(): void {
  //   this.shopService.getAllShops().subscribe({
  //     next: (shops) => {
  //       console.log(shops);

  //       this.shops = shops.Data;
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.error = 'Failed to load shops. Please try again later.';
  //       this.loading = false;
  //       console.error('Error fetching shops:', err);
  //     },
  //   });
  // }
  loadAllShops() {
    this.loading = true;
    this.error = null;

    this.shopService.getAllShops().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.IsSuccess) {
          this.shops = res.Data;
        } else {
          this.shops = [];
          this.error = res.Message || 'Failed to load shops';
        }
      },
      error: (err) => {
        this.loading = false;
        this.shops = [];
        this.error = err.error?.Message || 'Failed to load shops';
      },
    });
  }
}
