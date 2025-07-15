import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../Services/wishlist.service';
import { WishlistItem } from '../../Models/wishlist.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartServicesService } from '../../Services/CardServices.service';

@Component({
  selector: 'app-wishlist-section',
  templateUrl: './wishlist-section.component.html',
  styleUrls: ['./wishlist-section.component.css'],
  standalone: false,
})
export class WishlistSectionComponent implements OnInit {
  [x: string]: any;
  wishlistItems: WishlistItem[] = [];
  wishlistProductIds: Set<number> = new Set();
  errorMessage: string = '';
  specialRequestForm: FormGroup;
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private wishlistService: WishlistService,
    private fb: FormBuilder,
    private cartService: CartServicesService
  ) {
    this.specialRequestForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(2)]],
      productDescription: ['', [Validators.required, Validators.minLength(10)]],
      priceRange: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.isLoading = true;
    this.errorMessage = '';

    this.wishlistService
      .getWishlist(this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          console.log('Wishlist data:', data);
          this.wishlistItems = data;
          this.wishlistProductIds = new Set(data.map((item) => item.ProductId));
          this.totalItems = data.length;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading wishlist:', err);
          this.errorMessage = 'Failed to load wishlist. Please try again.';
          this.isLoading = false;
          this.hideErrorMessage();
        },
      });
  }

  deleteProduct(productId: number) {
    if (
      !confirm('Are you sure you want to remove this item from your wishlist?')
    ) {
      return;
    }

    this.wishlistService.deleteProduct(productId).subscribe({
      next: (msg) => {
        this.errorMessage =
          msg || 'Product removed from wishlist successfully!';
        this.loadWishlist();
        this.wishlistService.refreshWishlistCount();
        this.hideErrorMessage();
      },
      error: (err) => {
        console.error('Error deleting product:', err);
        this.errorMessage =
          'Failed to remove product from wishlist. Please try again.';
        this.hideErrorMessage();
      },
    });
  }

  clearWishlist() {
    if (!confirm('Are you sure you want to clear your entire wishlist?')) {
      return;
    }

    this.wishlistService.clearWishlist().subscribe({
      next: (msg) => {
        this.errorMessage = msg || 'Wishlist cleared successfully!';
        this.loadWishlist();
        this.wishlistService.refreshWishlistCount();
        this.hideErrorMessage();
      },
      error: (err) => {
        console.error('Error clearing wishlist:', err);
        this.errorMessage = 'Failed to clear wishlist. Please try again.';
        this.hideErrorMessage();
      },
    });
  }

  submitSpecialRequest() {
    if (this.specialRequestForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      // Simulate API call - replace with actual service call
      setTimeout(() => {
        console.log(
          'Special Request Submitted:',
          this.specialRequestForm.value
        );
        this.specialRequestForm.reset();
        this.errorMessage =
          'Special request submitted successfully! We will contact you soon.';
        this.isSubmitting = false;
        this.hideErrorMessage();
      }, 1000);
    } else {
      this.markFormGroupTouched(this.specialRequestForm);
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.hideErrorMessage();
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private hideErrorMessage() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  changePage(page: number) {
    if (page !== this.currentPage && !this.isLoading) {
      this.currentPage = page;
      this.loadWishlist();
    }
  }

  addToCart(item: WishlistItem) {
    // Default quantity 1, use item.ProductPrice and item.ProductPoints if available
    this.cartService
      .addToCart(item.ProductId, 1, item.ProductPrice, item.ProductPoints || 0)
      .subscribe({
        next: () => {
          this.errorMessage = 'Product added to cart!';
          this.hideErrorMessage();
        },
        error: (err) => {
          console.error('Error adding to cart:', err);
          this.errorMessage = 'Failed to add product to cart.';
          this.hideErrorMessage();
        },
      });
  }

  toggleWishlist(item: WishlistItem) {
    if (this.wishlistProductIds.has(item.ProductId)) {
      // Remove from wishlist
      this.wishlistService.deleteProduct(item.ProductId).subscribe({
        next: () => {
          this.wishlistProductIds.delete(item.ProductId);
          this.wishlistItems = this.wishlistItems.filter(
            (i) => i.ProductId !== item.ProductId
          );
          this.wishlistService.refreshWishlistCount();
        },
        error: (err) => {
          console.error('Error removing from wishlist:', err);
          this.errorMessage = 'Failed to remove from wishlist.';
          this.hideErrorMessage();
        },
      });
    } else {
      // Add to wishlist
      this.wishlistService.addToWishlist(item.ProductId).subscribe({
        next: () => {
          this.wishlistProductIds.add(item.ProductId);
          // Optionally, reload or push item to wishlistItems if needed
          this.wishlistService.refreshWishlistCount();
        },
        error: (err) => {
          console.error('Error adding to wishlist:', err);
          this.errorMessage = 'Failed to add to wishlist.';
          this.hideErrorMessage();
        },
      });
    }
  }

  // Helper method to get form control errors
  getFormControlError(controlName: string): string {
    const control = this.specialRequestForm.get(controlName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${controlName} is required.`;
      }
      if (control.errors['minlength']) {
        return `${controlName} must be at least ${control.errors['minlength'].requiredLength} characters long.`;
      }
    }
    return '';
  }

  // Method to check if form control has error
  hasFormControlError(controlName: string): boolean {
    const control = this.specialRequestForm.get(controlName);
    return !!(control && control.errors && control.touched);
  }

  // Method to track by function for *ngFor performance
  trackByProductId(index: number, item: WishlistItem): number {
    return item.ProductId;
  }
}
