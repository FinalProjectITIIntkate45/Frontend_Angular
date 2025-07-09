import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../Services/vendor.service';
import { VendorProfile } from '../../Models/vendor-profile.model';

@Component({
  selector: 'app-shop-info',
  templateUrl: './shop-info.component.html',
  styleUrls: ['./shop-info.component.css'],
  standalone: false,
})
export class ShopInfoComponent implements OnInit {
  shopData: VendorProfile | null = null;

  constructor(private vendorService: VendorService) {}

  ngOnInit(): void {
    this.vendorService.getVendorProfile().subscribe({
      next: (data) => {
        this.shopData = data;
      },
      error: (err) => console.error('Error fetching shop info', err),
    });
  }
}
