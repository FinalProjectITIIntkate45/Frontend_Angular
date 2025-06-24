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
[x: string]: any;
  wishlistItems: WishlistItem[] = [];
  errorMessage: string = '';
  specialRequestForm: FormGroup;
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

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
    this.wishlistService.getWishlist(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        console.log('Wishlist data:', data);
        this.wishlistItems = data;
        // افتراض أن API يعيد إجمالي العناصر في رأس الاستجابة أو البيانات
        this.totalItems = data.length; // يجب تحديث هذا بناءً على استجابة API
      },
      error: (err) => {
        this.errorMessage = 'فشل تحميل قائمة الرغبات';
      },
    });
  }

  deleteProduct(productId: number) {
    this.wishlistService.deleteProduct(productId).subscribe({
      next: (msg) => {
        this.errorMessage = msg;
        this.loadWishlist();
      },
      error: (err) => (this.errorMessage = 'فشل حذف المنتج من قائمة الرغبات'),
    });
  }

  clearWishlist() {
    this.wishlistService.clearWishlist().subscribe({
      next: (msg) => {
        this.errorMessage = msg;
        this.loadWishlist();
      },
      error: (err) => (this.errorMessage = 'فشل مسح قائمة الرغبات'),
    });
  }



  submitSpecialRequest() {
    if (this.specialRequestForm.valid) {
      console.log('Special Request Submitted:', this.specialRequestForm.value);
      this.specialRequestForm.reset();
      this.errorMessage = 'تم إرسال الطلب الخاص بنجاح!';
    } else {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة';
    }
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadWishlist();
  }
}