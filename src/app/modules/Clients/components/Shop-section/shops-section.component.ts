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
  shops: ShopViewModel[] = []; // Initialized to avoid undefined issues

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.loadAllShops();
  }

  loadAllShops() {
    this.loading = true;
    this.error = null;

    this.shopService.getAllShops().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.IsSuccess) {
          this.shops = res.Data || [];
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