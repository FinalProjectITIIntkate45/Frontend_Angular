import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../Services/vendor.service';
import { VendorProfile } from '../../Models/vendor-profile.model';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.css'],
  standalone: false,
})
export class VendorProfileComponent implements OnInit {
  profile: VendorProfile | null = null;

  constructor(private vendorService: VendorService) {}

  ngOnInit(): void {
    this.vendorService.getVendorProfile().subscribe({
      next: data => {
        this.profile = data
        console.log('Vendor profile fetched successfully', this.profile);
        
      
      },

      error: err => console.error('Error fetching vendor profile', err)
    });
  }
}
