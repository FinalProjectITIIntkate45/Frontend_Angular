import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../Services/wishlist.service';
import { WishlistItem } from '../../Models/wishlist.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-wishlist-section',
  templateUrl: './wishlist-section.component.html',
  styleUrls: ['./wishlist-section.component.css'],
  standalone: false,
})
export class WishlistSectionComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  errorMessage: string = '';
  specialRequestForm: FormGroup;
  product: any;

  constructor(
    private wishlistService: WishlistService,
    private fb: FormBuilder
  ) {
    this.specialRequestForm = this.fb.group({
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      priceRange: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (data) => {
        console.log(data);

        this.wishlistItems = data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load wishlist';
      },
    });
  }

  deleteProduct(productId: number) {
    this.wishlistService.deleteProduct(productId).subscribe({
      next: (msg) => {
        this.errorMessage = msg;
        this.loadWishlist();
      },
      error: (err) => (this.errorMessage = 'Failed to delete product'),
    });
  }

  clearWishlist() {
    this.wishlistService.clearWishlist().subscribe({
      next: (msg) => {
        this.errorMessage = msg;
        this.loadWishlist();
      },
      error: (err) => (this.errorMessage = 'Failed to clear wishlist'),
    });
  }

  addToBag(productId: number) {
    console.log(`Added product ${productId} to bag`);
  }

  addToWishlist(productId: number) {
    this.wishlistService.addToWishlist(productId).subscribe({
      next: (msg) => {
        this.errorMessage = msg;
        this.loadWishlist();
      },
      error: (err) => (this.errorMessage = 'Failed to add product to wishlist'),
    });
  }

  submitSpecialRequest() {
    if (this.specialRequestForm.valid) {
      console.log('Special Request Submitted:', this.specialRequestForm.value);
      this.specialRequestForm.reset();
    } else {
      this.errorMessage = 'Please fill all required fields';
    }
  }
}
