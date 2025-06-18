import { Component, OnInit } from '@angular/core';

// import { ShopViewModel } from '../../Models/shop-view-model';
import { ShopService } from '../../Services/shop.service';
import { ShopViewModel } from '../../Models/shop-view-model';

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
